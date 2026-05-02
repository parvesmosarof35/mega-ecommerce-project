import { CreateOrderData, Order, OrderResponse, OrderListResponse } from './order.interface';
import { ORDER_STATUS, PAYMENT_STATUS, DEFAULT_CURRENCY } from './order.constant';
import OrderModel from './order.model';
import product from '../products/products.model';

// In-memory storage for orders (replace with database in production)
const normalizeOrder = (doc: any): Order => {
  const items = Array.isArray(doc?.items)
    ? doc.items.map((item: any) => ({
        ...item,
        productId: item?.productId != null ? String(item.productId) : item?.productId,
      }))
    : [];

  return {
    ...doc,
    _id: doc?._id != null ? String(doc._id) : doc?._id,
    customerId: doc?.customerId != null ? String(doc.customerId) : doc?.customerId,
    items,
  } as Order;
};

const decrementStockForOrderItems = async (items: any[]) => {
  for (const item of items) {
    const quantity = Number(item?.quantity ?? 0);
    const productId = item?.productId;

    if (!productId || !Number.isFinite(quantity) || quantity <= 0) continue;

    const updated = await product.updateOne(
      { _id: productId, stock_quantity: { $gte: quantity } },
      { $inc: { stock_quantity: -quantity } }
    );

    if (updated.modifiedCount !== 1) {
      throw new Error(`Insufficient stock for product ${String(productId)}`);
    }
  }
};

class OrderService {
  async createOrder(orderData: CreateOrderData): Promise<OrderResponse> {
    try {
      const order = await OrderModel.create({
        customerId: orderData.customerId,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress || orderData.shippingAddress,
        status: ORDER_STATUS.PENDING,
        paymentStatus: PAYMENT_STATUS.PENDING,
        notes: orderData.notes,
        currency: orderData.currency || DEFAULT_CURRENCY,
      });

      return {
        status: true,
        message: 'Order created successfully',
        data: { order: normalizeOrder(order.toObject()) },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to create order',
      };
    }
  }

  async getOrderById(orderId: string): Promise<OrderResponse> {
    try {
      const order = await OrderModel.findById(orderId).lean();

      if (!order) {
        return {
          status: false,
          message: 'Order not found',
        };
      }

      return {
        status: true,
        message: 'Order retrieved successfully',
        data: { order: normalizeOrder(order) },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to retrieve order',
      };
    }
  }

  async getOrdersByCustomerId(customerId: string, page: number = 1, limit: number = 10): Promise<OrderListResponse> {
    try {
      const startIndex = (page - 1) * limit;

      const [customerOrders, total] = await Promise.all([
        OrderModel.find({ customerId })
          .sort({ createdAt: -1 })
          .skip(startIndex)
          .limit(limit)
          .lean(),
        OrderModel.countDocuments({ customerId }),
      ]);

      return {
        status: true,
        message: 'Orders retrieved successfully',
        data: {
          orders: customerOrders.map(normalizeOrder),
          total,
          page,
          limit,
        },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to retrieve orders',
      };
    }
  }

  async getAllOrders(page: number = 1, limit: number = 10, status?: string, paymentStatus?: string): Promise<OrderListResponse> {
    try {
      const filter: Record<string, unknown> = {};
      if (status) filter.status = status;
      if (paymentStatus) filter.paymentStatus = paymentStatus;

      const startIndex = (page - 1) * limit;

      const [ordersList, total] = await Promise.all([
        OrderModel.find(filter)
          .sort({ createdAt: -1 })
          .skip(startIndex)
          .limit(limit)
          .lean(),
        OrderModel.countDocuments(filter),
      ]);

      return {
        status: true,
        message: 'Orders retrieved successfully',
        data: {
          orders: ordersList.map(normalizeOrder),
          total,
          page,
          limit,
        },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to retrieve orders',
      };
    }
  }

  async updateOrderStatus(orderId: string, status: string, notes?: string): Promise<OrderResponse> {
    try {
      const order = await OrderModel.findById(orderId);

      if (!order) {
        return {
          status: false,
          message: 'Order not found',
        };
      }

      order.status = status as any;
      if (notes) order.notes = notes;
      await order.save();

      return {
        status: true,
        message: 'Order status updated successfully',
        data: { order: normalizeOrder(order.toObject()) },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to update order status',
      };
    }
  }

  async updatePaymentStatus(orderId: string, paymentStatus: string, paymentIntentId?: string, stripePaymentId?: string): Promise<OrderResponse> {
    try {
      const order = await OrderModel.findById(orderId);

      if (!order) {
        return {
          status: false,
          message: 'Order not found',
        };
      }

      const previousPaymentStatus = order.paymentStatus;

      order.paymentStatus = paymentStatus as any;
      if (paymentIntentId) order.paymentIntentId = paymentIntentId;
      if (stripePaymentId) order.stripePaymentId = stripePaymentId;

      // Auto-update order status based on payment status
      if (paymentStatus === PAYMENT_STATUS.PAID && order.status === ORDER_STATUS.PENDING) {
        order.status = ORDER_STATUS.CONFIRMED;
      } else if (paymentStatus === PAYMENT_STATUS.FAILED) {
        order.status = ORDER_STATUS.CANCELLED;
      }

      if (previousPaymentStatus !== PAYMENT_STATUS.PAID && paymentStatus === PAYMENT_STATUS.PAID) {
        await decrementStockForOrderItems(order.items);
      }

      await order.save();

      return {
        status: true,
        message: 'Payment status updated successfully',
        data: { order: normalizeOrder(order.toObject()) },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to update payment status',
      };
    }
  }

  async cancelOrder(orderId: string, reason?: string): Promise<OrderResponse> {
    try {
      const order = await OrderModel.findById(orderId);

      if (!order) {
        return {
          status: false,
          message: 'Order not found',
        };
      }

      // Can only cancel pending orders
      if (order.status !== ORDER_STATUS.PENDING) {
        return {
          status: false,
          message: 'Cannot cancel order. Order is already being processed.',
        };
      }

      order.status = ORDER_STATUS.CANCELLED;
      if (reason) order.notes = reason;
      await order.save();

      return {
        status: true,
        message: 'Order cancelled successfully',
        data: { order: normalizeOrder(order.toObject()) },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || 'Failed to cancel order',
      };
    }
  }

  // Helper method to get order for payment processing
  async getOrderForPayment(orderId: string): Promise<Order | null> {
    const order = await OrderModel.findById(orderId).lean();
    return order ? normalizeOrder(order) : null;
  }
}

export default OrderService;