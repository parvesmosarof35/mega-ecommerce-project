import { Request, Response } from "express";
import { ZodError } from "zod";
import PaymentService from "./payment.service";
import PaymentValidationSchemas from "./payment.validation";
import CartPaymentValidationSchemas from "./cart-payment.validation";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/asyncCatch";
import handelZodError from "../../errors/handelZodError";

class PaymentControllerClass {
  private paymentService: PaymentService;

  constructor() {
    this.paymentService = new PaymentService();
  }

  createCartCheckoutSession = catchAsync(
    async (req: Request, res: Response) => {
      try {
        // Log incoming request
        console.log('=== CART CHECKOUT SESSION REQUEST ===');
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('User from token:', req.user);
        
        const userId = req.user?.id;
        if (!userId) {
          console.log('ERROR: User authentication required');
          return sendResponse(res, {
            statusCode: 401,
            success: false,
            message: "User authentication required",
            data: null,
          });
        }

        const validatedData =
          CartPaymentValidationSchemas.createCartCheckoutSessionSchema.parse(
            req
          );
        
        console.log('Validated data:', validatedData);
        
        const result = await this.paymentService.createCartCheckoutSession(
          validatedData.body,
          userId,
          'card' // Specify payment method type
        );

        console.log('Payment service result:', result);

        if (result.status) {
          const response = {
            statusCode: 200,
            success: true,
            message: result.message,
            data: result.data,
          };
          console.log('=== SUCCESS RESPONSE ===');
          console.log('Response:', response);
          
          sendResponse(res, response);
        } else {
          const response = {
            statusCode: 400,
            success: false,
            message: result.message,
            data: null,
          };
          console.log('=== ERROR RESPONSE ===');
          console.log('Response:', response);
          
          sendResponse(res, response);
        }
      } catch (error) {
        console.log('=== CATCH BLOCK ERROR ===');
        console.log('Error:', error);
        
        if (error instanceof ZodError) {
          const zodError = handelZodError(error);
          console.log('Zod error:', zodError);
          sendResponse(res, {
            statusCode: zodError.statusCode,
            success: false,
            message: zodError.message,
            errorSources: zodError.errorSources,
            data: null,
          });
        } else {
          console.log('Generic error:', error);
          sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Internal server error",
            data: null,
          });
        }
      }
    }
  );

  createGooglePayCheckoutSession = catchAsync(
    async (req: Request, res: Response) => {
      try {
        // Log incoming request
        console.log('=== GOOGLE PAY CHECKOUT SESSION REQUEST ===');
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('User from token:', req.user);
        
        const userId = req.user?.id;
        if (!userId) {
          console.log('ERROR: User authentication required');
          return sendResponse(res, {
            statusCode: 401,
            success: false,
            message: "User authentication required",
            data: null,
          });
        }

        const validatedData =
          CartPaymentValidationSchemas.createCartCheckoutSessionSchema.parse(
            req
          );
        
        console.log('Validated data:', validatedData);
        
        const result = await this.paymentService.createCartCheckoutSession(
          validatedData.body,
          userId,
          'google_pay' // Specify payment method type
        );

        console.log('Payment service result:', result);

        if (result.status) {
          const response = {
            statusCode: 200,
            success: true,
            message: result.message,
            data: result.data,
          };
          console.log('=== SUCCESS RESPONSE ===');
          console.log('Response:', response);
          
          sendResponse(res, response);
        } else {
          const response = {
            statusCode: 400,
            success: false,
            message: result.message,
            data: null,
          };
          console.log('=== ERROR RESPONSE ===');
          console.log('Response:', response);
          
          sendResponse(res, response);
        }
      } catch (error) {
        console.log('=== CATCH BLOCK ERROR ===');
        console.log('Error:', error);
        
        if (error instanceof ZodError) {
          const zodError = handelZodError(error);
          console.log('Zod error:', zodError);
          sendResponse(res, {
            statusCode: zodError.statusCode,
            success: false,
            message: zodError.message,
            errorSources: zodError.errorSources,
            data: null,
          });
        } else {
          console.log('Generic error:', error);
          sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Internal server error",
            data: null,
          });
        }
      }
    }
  );

  createApplePayCheckoutSession = catchAsync(
    async (req: Request, res: Response) => {
      try {
        // Log incoming request
        console.log('=== APPLE PAY CHECKOUT SESSION REQUEST ===');
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('User from token:', req.user);
        
        const userId = req.user?.id;
        if (!userId) {
          console.log('ERROR: User authentication required');
          return sendResponse(res, {
            statusCode: 401,
            success: false,
            message: "User authentication required",
            data: null,
          });
        }

        const validatedData =
          CartPaymentValidationSchemas.createCartCheckoutSessionSchema.parse(
            req
          );
        
        console.log('Validated data:', validatedData);
        
        const result = await this.paymentService.createCartCheckoutSession(
          validatedData.body,
          userId,
          'apple_pay' // Specify payment method type
        );

        console.log('Payment service result:', result);

        if (result.status) {
          const response = {
            statusCode: 200,
            success: true,
            message: result.message,
            data: result.data,
          };
          console.log('=== SUCCESS RESPONSE ===');
          console.log('Response:', response);
          
          sendResponse(res, response);
        } else {
          const response = {
            statusCode: 400,
            success: false,
            message: result.message,
            data: null,
          };
          console.log('=== ERROR RESPONSE ===');
          console.log('Response:', response);
          
          sendResponse(res, response);
        }
      } catch (error) {
        console.log('=== CATCH BLOCK ERROR ===');
        console.log('Error:', error);
        
        if (error instanceof ZodError) {
          const zodError = handelZodError(error);
          console.log('Zod error:', zodError);
          sendResponse(res, {
            statusCode: zodError.statusCode,
            success: false,
            message: zodError.message,
            errorSources: zodError.errorSources,
            data: null,
          });
        } else {
          console.log('Generic error:', error);
          sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Internal server error",
            data: null,
          });
        }
      }
    }
  );

  getAvailablePaymentMethods = catchAsync(
    async (req: Request, res: Response) => {
      try {
        console.log('=== GET AVAILABLE PAYMENT METHODS REQUEST ===');
        
        const result = await this.paymentService.getAvailablePaymentMethods();

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
      } catch (error) {
        console.log('=== CATCH BLOCK ERROR ===');
        console.log('Error:', error);
        
        sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Internal server error",
          data: null,
        });
      }
    }
  );

  createMultiplePaymentCheckoutSession = catchAsync(
    async (req: Request, res: Response) => {
      try {
        // Log incoming request
        console.log('=== MULTIPLE PAYMENT CHECKOUT SESSION REQUEST ===');
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('User from token:', req.user);
        
        const userId = req.user?.id;
        if (!userId) {
          console.log('ERROR: User authentication required');
          return sendResponse(res, {
            statusCode: 401,
            success: false,
            message: "User authentication required",
            data: null,
          });
        }

        // Validate that paymentMethodType is provided
        const { paymentMethodType, ...paymentData } = req.body;
        if (!paymentMethodType) {
          console.log('ERROR: Payment method type is required');
          return sendResponse(res, {
            statusCode: 400,
            success: false,
            message: "Payment method type is required",
            data: null,
          });
        }

        // Create a modified request object for validation
        const modifiedReq = {
          ...req,
          body: paymentData
        };

        const validatedData =
          CartPaymentValidationSchemas.createCartCheckoutSessionSchema.parse(
            modifiedReq
          );
        
        console.log('Validated data:', validatedData);
        console.log('Payment method type:', paymentMethodType);
        
        const result = await this.paymentService.createCartCheckoutSession(
          validatedData.body,
          userId,
          paymentMethodType // Use the payment method from request body
        );

        console.log('Payment service result:', result);

        if (result.status) {
          const response = {
            statusCode: 200,
            success: true,
            message: result.message,
            data: result.data,
          };
          console.log('=== SUCCESS RESPONSE ===');
          console.log('Response:', response);
          
          sendResponse(res, response);
        } else {
          const response = {
            statusCode: 400,
            success: false,
            message: result.message,
            data: null,
          };
          console.log('=== ERROR RESPONSE ===');
          console.log('Response:', response);
          
          sendResponse(res, response);
        }
      } catch (error) {
        console.log('=== CATCH BLOCK ERROR ===');
        console.log('Error:', error);
        
        if (error instanceof ZodError) {
          const zodError = handelZodError(error);
          console.log('Zod error:', zodError);
          sendResponse(res, {
            statusCode: zodError.statusCode,
            success: false,
            message: zodError.message,
            errorSources: zodError.errorSources,
            data: null,
          });
        } else {
          console.log('Generic error:', error);
          sendResponse(res, {
            statusCode: 500,
            success: false,
            message: "Internal server error",
            data: null,
          });
        }
      }
    }
  );

  confirmPayment = catchAsync(async (req: Request, res: Response) => {
    try {
      const validatedData =
        PaymentValidationSchemas.confirmPaymentSchema.parse(req);
      const result = await this.paymentService.confirmPayment(
        validatedData.body.paymentIntentId
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
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = handelZodError(error);
        sendResponse(res, {
          statusCode: zodError.statusCode,
          success: false,
          message: zodError.message,
          errorSources: zodError.errorSources,
          data: null,
        });
      } else {
        sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Internal server error",
          data: null,
        });
      }
    }
  });

  refundPayment = catchAsync(async (req: Request, res: Response) => {
    try {
      const validatedData =
        PaymentValidationSchemas.refundPaymentSchema.parse(req);
      const result = await this.paymentService.refundPayment(
        validatedData.body.paymentIntentId,
        validatedData.body.amount
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
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = handelZodError(error);
        sendResponse(res, {
          statusCode: zodError.statusCode,
          success: false,
          message: zodError.message,
          errorSources: zodError.errorSources,
          data: null,
        });
      } else {
        sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Internal server error",
          data: null,
        });
      }
    }
  });

  createDirectPayment = catchAsync(async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return sendResponse(res, {
          statusCode: 401,
          success: false,
          message: "User authentication required",
          data: null,
        });
      }

      const validatedData =
        CartPaymentValidationSchemas.createDirectPaymentSchema.parse(req);
      const result = await this.paymentService.createDirectPayment(
        validatedData.body,
        userId
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
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = handelZodError(error);
        sendResponse(res, {
          statusCode: zodError.statusCode,
          success: false,
          message: zodError.message,
          errorSources: zodError.errorSources,
          data: null,
        });
      } else {
        sendResponse(res, {
          statusCode: 500,
          success: false,
          message: "Internal server error",
          data: null,
        });
      }
    }
  });

  webhookHandler = catchAsync(async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string;
    const payload = req.rawBody ?? req.body;

    try {
      const event = await this.paymentService.constructWebhookEvent(
        payload,
        signature
      );
      const result = await this.paymentService.processWebhookEvent(event);

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
    } catch (error: any) {
      sendResponse(res, {
        statusCode: 400,
        success: false,
        message: `Webhook Error: ${error.message}`,
        data: null,
      });
    }
  });
}

const PaymentControllerInstance = new PaymentControllerClass();

const PaymentController = {
  createCartCheckoutSession:
    PaymentControllerInstance.createCartCheckoutSession,
  createGooglePayCheckoutSession:
    PaymentControllerInstance.createGooglePayCheckoutSession,
  createApplePayCheckoutSession:
    PaymentControllerInstance.createApplePayCheckoutSession,
  createMultiplePaymentCheckoutSession:
    PaymentControllerInstance.createMultiplePaymentCheckoutSession,
  getAvailablePaymentMethods:
    PaymentControllerInstance.getAvailablePaymentMethods,
  confirmPayment: PaymentControllerInstance.confirmPayment,
  refundPayment: PaymentControllerInstance.refundPayment,
  createDirectPayment: PaymentControllerInstance.createDirectPayment,
  webhookHandler: PaymentControllerInstance.webhookHandler,
};

export default PaymentController;
