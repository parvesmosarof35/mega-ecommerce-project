import { z } from "zod";

const createOrderSchema = z.object({
  body: z.object({
    customerId: z.string({ message: "Customer ID is required" }),
    items: z.array(z.object({
      productId: z.string({ message: "Product ID is required" }),
      quantity: z.number({ message: "Quantity is required" }).min(1, { message: "Quantity must be at least 1" }),
      price: z.number({ message: "Price is required" }).min(0, { message: "Price must be positive" }),
      name: z.string().optional(),
      image: z.string().optional(),
    })).min(1, { message: "At least one item is required" }),
    totalAmount: z.number({ message: "Total amount is required" }).min(0, { message: "Total amount must be positive" }),
    shippingAddress: z.object({
      street: z.string({ message: "Street is required" }),
      city: z.string({ message: "City is required" }),
      state: z.string({ message: "State is required" }),
      postalCode: z.string({ message: "Postal code is required" }),
      country: z.string({ message: "Country is required" }),
      phone: z.string({ message: "Phone is required" }),
      email: z.string({ message: "Email is required" }),
    }),
    billingAddress: z.object({
      street: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
      phone: z.string(),
      email: z.string(),
    }).optional(),
    notes: z.string().optional(),
    currency: z.string().default("usd"),
  }),
});

const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
    notes: z.string().optional(),
  }),
});

const updatePaymentStatusSchema = z.object({
  body: z.object({
    paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']),
    paymentIntentId: z.string().optional(),
    stripePaymentId: z.string().optional(),
  }),
});

const getOrderListSchema = z.object({
  query: z.object({
    page: z.string().transform(Number).default(1),
    limit: z.string().transform(Number).default(10),
    status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
    paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
    customerId: z.string().optional(),
  }),
});

const OrderValidationSchemas = {
  createOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
  getOrderListSchema,
};

export default OrderValidationSchemas;
