import { Request, Response } from 'express';
import httpStatus from 'http-status';
import OrderService from './order.service';
import OrderValidationSchemas from './order.validation';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/asyncCatch';
import AppError from '../../errors/AppError';
import { USER_ROLE } from '../user/user.constant';

class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  createGuestOrder = catchAsync(async (req: Request, res: Response) => {
    const validatedData = OrderValidationSchemas.createGuestOrderSchema.parse(req);
    const result = await this.orderService.createGuestOrder(validatedData.body as any);

    if (result.status) {
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: result.message,
        data: null,
      });
    }
  });

  getOrderById = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const result = await this.orderService.getOrderById(orderId);

    if (result.status) {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      sendResponse(res, {
        statusCode: 404,
        success: false,
        message: result.message,
        data: null,
      });
    }
  });

  getAllOrders = catchAsync(async (req: Request, res: Response) => {
    const validatedData = OrderValidationSchemas.getOrderListSchema.parse(req);
    const { page, limit, status, paymentStatus } = validatedData.query;
    
    const result = await this.orderService.getAllOrders(page, limit, status, paymentStatus);

    if (result.status) {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: result.message,
        data: null,
      });
    }
  });

  updateOrderStatus = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { status, notes } = req.body;
    
    const result = await this.orderService.updateOrderStatus(orderId, status, notes);

    if (result.status) {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: result.message,
        data: null,
      });
    }
  });

  updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { paymentStatus, paymentIntentId, stripePaymentId } = req.body;
    
    const result = await this.orderService.updatePaymentStatus(
      orderId,
      paymentStatus,
      paymentIntentId,
      stripePaymentId
    );

    if (result.status) {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: result.message,
        data: null,
      });
    }
  });

  cancelOrder = catchAsync(async (req: Request, res: Response) => {
    const { orderId } = req.params;
    const { reason } = req.body;
    
    const result = await this.orderService.cancelOrder(orderId, reason);

    if (result.status) {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: result.message,
        data: null,
      });
    }
  });

  getOrdersByCustomerId = catchAsync(async (req: Request, res: Response) => {
    const { customerId } = req.params;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    // Authorization check: only allow owners or admin/superAdmin
    if (
      req.user?.role !== USER_ROLE.admin &&
      req.user?.role !== USER_ROLE.superAdmin &&
      req.user?.id !== customerId
    ) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized to view these orders', '');
    }

    const result = await this.orderService.getOrdersByCustomerId(customerId, page, limit);

    if (result.status) {
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: result.message,
        data: result.data,
      });
    } else {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: result.message,
        data: null,
      });
    }
  });
}

export default new OrderController();
