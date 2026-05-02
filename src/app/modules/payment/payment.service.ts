import Stripe from "stripe";
import config from "../../config";
import { PaymentResponse, WebhookEvent } from "./payment.interface";
import { PAYMENT_STATUS, WEBHOOK_EVENTS } from "./payment.constant";
import OrderService from "../order/order.service";
import CartServices from "../cart/cart.services";
import {
  CartPaymentRequest,
  CartPaymentResponse,
  CartPaymentMetadata,
} from "./cart-payment.interface";
import { CartDocument } from "../cart/cart.interface";
import { compressMetadata, decompressMetadata } from "./metadata.utils";

const stripe = new Stripe(
  config.stripe_payment_gateway.stripe_secret_key || "",
  {
    apiVersion: "2025-08-27.basil",
  }
);

class PaymentService {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  async createCartCheckoutSession(
    paymentRequest: CartPaymentRequest,
    userId: string,
    paymentMethodType: string = 'card'
  ): Promise<CartPaymentResponse> {
    try {
      console.log('=== PAYMENT SERVICE CREATE CART CHECKOUT ===');
      console.log('Payment request:', paymentRequest);
      console.log('User ID:', userId);
      console.log('Payment method type:', paymentMethodType);
      
      // Get user's cart items from database
      const cartResult = await CartServices.getCartByUser(userId, {});
      console.log('Cart result:', cartResult);

      if (!cartResult.result || cartResult.result.length === 0) {
        console.log('ERROR: Empty cart');
        return {
          status: false,
          message:
            "Your cart is empty. Please add items to your cart before proceeding.",
        };
      }

      // Calculate total amount
      const totalAmount = cartResult.summary.subtotal;
      console.log('Total amount:', totalAmount);

      if (totalAmount <= 0) {
        console.log('ERROR: Invalid cart total');
        return {
          status: false,
          message: "Invalid cart total. Please check your cart items.",
        };
      }

      // Transform cart items to payment items with better error handling
      const cartItems = cartResult.result.map(
        (item: CartDocument & { product_id: any }) => {
          if (!item.product_id) {
            throw new Error(`Product not found for cart item: ${item._id}`);
          }
          if (!item.product_id._id) {
            throw new Error(
              `Product ID is missing for product: ${item.product_id}`
            );
          }
          return {
            productId: item.product_id._id,
            quantity: item.quantity,
            price: item.price_at_addition,
            name: item.product_id.name || `Product ${item.product_id._id}`,
            image: item.product_id.image,
          };
        }
      );
      console.log('Transformed cart items:', cartItems);

      // Create metadata for order creation after payment
      const metadata: CartPaymentMetadata = {
        customerId: userId,
        items: cartItems,
        totalAmount,
        shippingAddress: paymentRequest.shippingAddress,
        billingAddress: paymentRequest.billingAddress,
        currency: paymentRequest.currency || "usd",
        notes: paymentRequest.notes,
      };
      console.log('Original metadata:', metadata);
      console.log('Original metadata JSON length:', JSON.stringify(metadata).length);

      // Compress metadata to handle Stripe's character limits (500 chars as Stripe enforces)
      const compressedMetadata = compressMetadata(metadata, 500);
      console.log('Compressed metadata:', compressedMetadata);
      console.log('Compressed metadata field sizes:', Object.entries(compressedMetadata).map(([key, value]) => ({ key, length: value.length })));

      // Determine payment method types based on payment method type
      let paymentMethodTypes: string[];
      let paymentMethodName: string;

      switch (paymentMethodType) {
        case 'multiple':
          // Include multiple popular payment methods for user to choose from
          paymentMethodTypes = [
            'card',
            'klarna',
            'afterpay_clearpay',
            'sepa_debit',
            'ideal'
          ];
          paymentMethodName = 'Multiple Payment Options';
          break;
        case 'google_pay':
          paymentMethodTypes = ['card']; // Google Pay uses card infrastructure
          paymentMethodName = 'Google Pay';
          break;
        case 'apple_pay':
          paymentMethodTypes = ['card']; // Apple Pay uses card infrastructure
          paymentMethodName = 'Apple Pay';
          break;
        case 'paypal':
          paymentMethodTypes = ['paypal'];
          paymentMethodName = 'PayPal';
          break;
        case 'klarna':
          paymentMethodTypes = ['klarna'];
          paymentMethodName = 'Klarna';
          break;
        case 'afterpay_clearpay':
          paymentMethodTypes = ['afterpay_clearpay'];
          paymentMethodName = 'Afterpay/Clearpay';
          break;
        case 'sepa_debit':
          paymentMethodTypes = ['sepa_debit'];
          paymentMethodName = 'SEPA Direct Debit';
          break;
        case 'ideal':
          paymentMethodTypes = ['ideal'];
          paymentMethodName = 'iDEAL';
          break;
        case 'sofort':
          paymentMethodTypes = ['sofort'];
          paymentMethodName = 'Sofort';
          break;
        case 'giropay':
          paymentMethodTypes = ['giropay'];
          paymentMethodName = 'Giropay';
          break;
        case 'bancontact':
          paymentMethodTypes = ['bancontact'];
          paymentMethodName = 'Bancontact';
          break;
        case 'eps':
          paymentMethodTypes = ['eps'];
          paymentMethodName = 'EPS';
          break;
        case 'multibanco':
          paymentMethodTypes = ['multibanco'];
          paymentMethodName = 'Multibanco';
          break;
        case 'przelewy24':
          paymentMethodTypes = ['p24'];
          paymentMethodName = 'Przelewy24';
          break;
        case 'wechat_pay':
          paymentMethodTypes = ['wechat_pay'];
          paymentMethodName = 'WeChat Pay';
          break;
        case 'alipay':
          paymentMethodTypes = ['alipay'];
          paymentMethodName = 'Alipay';
          break;
        case 'crypto':
          paymentMethodTypes = ['crypto'];
          paymentMethodName = 'Cryptocurrency';
          break;
        case 'cashapp':
          paymentMethodTypes = ['cashapp'];
          paymentMethodName = 'Cash App Pay';
          break;
        case 'amazon_pay':
          paymentMethodTypes = ['amazon_pay'];
          paymentMethodName = 'Amazon Pay';
          break;
        case 'revolut_pay':
          paymentMethodTypes = ['revolut_pay'];
          paymentMethodName = 'Revolut Pay';
          break;
        case 'card':
        default:
          paymentMethodTypes = ['card'];
          paymentMethodName = 'Credit/Debit Card';
          break;
      }

      const sessionParams: any = {
        payment_method_types: paymentMethodTypes,
        line_items: cartItems.map((item) => ({
          price_data: {
            currency: paymentRequest.currency || "usd",
            product_data: {
              name: item.name || `Product ${item.productId}`,
              description: `Product ID: ${item.productId}`,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: config.stripe_payment_gateway.checkout_success_url,
        cancel_url: config.stripe_payment_gateway.checkout_cancel_url,
        metadata: {
          type: "cart_payment",
          customerId: userId,
          paymentMethodType,
          ...compressedMetadata,
        },
      };

      console.log('Stripe session params:', sessionParams);
      console.log('Final metadata field sizes:', Object.entries(sessionParams.metadata).map(([key, value]) => ({ key, length: (value as string).length })));

      const session = await stripe.checkout.sessions.create(sessionParams);
      console.log('Stripe session created successfully:', session.id);

      return {
        status: true,
        message: `Cart checkout session created successfully for ${paymentMethodName}`,
        data: {
          sessionId: session.id,
          paymentUrl: session.url || undefined,
          paymentMethodType,
        },
      };
    } catch (error: any) {
      console.log('=== PAYMENT SERVICE ERROR ===');
      console.log('Error details:', error);
      console.log('Error message:', error.message);
      console.log('Error stack:', error.stack);
      
      return {
        status: false,
        message: error.message || "Failed to create cart checkout session",
      };
    }
  }

  async getAvailablePaymentMethods(): Promise<PaymentResponse> {
    try {
      console.log('=== GET AVAILABLE PAYMENT METHODS ===');
      
      // Define available payment methods based on Stripe configuration
      const availableMethods = [
        {
          id: 'multiple',
          name: 'Choose Payment Method',
          description: 'Select from multiple payment options at checkout',
          icon: 'payment-options',
          enabled: true,
          popular: true,
        },
        {
          id: 'card',
          name: 'Credit/Debit Card',
          description: 'Pay with Visa, Mastercard, or other credit/debit cards',
          icon: 'credit-card',
          enabled: true,
          popular: false,
        },
        {
          id: 'google_pay',
          name: 'Google Pay',
          description: 'Pay with Google Pay for a faster checkout',
          icon: 'google-pay',
          enabled: true,
          popular: false,
        },
        {
          id: 'apple_pay',
          name: 'Apple Pay',
          description: 'Pay with Apple Pay for a secure checkout',
          icon: 'apple-pay',
          enabled: true,
          popular: false,
        },
        {
          id: 'klarna',
          name: 'Klarna',
          description: 'Buy now, pay later with Klarna',
          icon: 'klarna',
          enabled: true,
          popular: false,
        },
        {
          id: 'afterpay_clearpay',
          name: 'Afterpay/Clearpay',
          description: 'Buy now, pay later in installments',
          icon: 'afterpay',
          enabled: true,
          popular: false,
        },
        {
          id: 'sepa_debit',
          name: 'SEPA Direct Debit',
          description: 'Direct bank transfer from European accounts',
          icon: 'sepa',
          enabled: true,
          popular: false,
        },
        {
          id: 'ideal',
          name: 'iDEAL',
          description: 'Direct bank transfer from Dutch accounts',
          icon: 'ideal',
          enabled: true,
          popular: false,
        },
        {
          id: 'sofort',
          name: 'Sofort',
          description: 'Direct bank transfer from German/Austrian accounts',
          icon: 'sofort',
          enabled: true,
          popular: false,
        },
        {
          id: 'giropay',
          name: 'Giropay',
          description: 'Direct bank transfer from German accounts',
          icon: 'giropay',
          enabled: true,
          popular: false,
        },
        {
          id: 'bancontact',
          name: 'Bancontact',
          description: 'Popular payment method in Belgium',
          icon: 'bancontact',
          enabled: true,
          popular: false,
        },
        {
          id: 'eps',
          name: 'EPS',
          description: 'Online banking payment in Austria',
          icon: 'eps',
          enabled: true,
          popular: false,
        },
        {
          id: 'multibanco',
          name: 'Multibanco',
          description: 'Popular payment method in Portugal',
          icon: 'multibanco',
          enabled: true,
          popular: false,
        },
        {
          id: 'przelewy24',
          name: 'Przelewy24',
          description: 'Online banking payment in Poland',
          icon: 'p24',
          enabled: true,
          popular: false,
        },
        {
          id: 'wechat_pay',
          name: 'WeChat Pay',
          description: 'Popular payment method in China',
          icon: 'wechat-pay',
          enabled: true,
          popular: false,
        },
        {
          id: 'alipay',
          name: 'Alipay',
          description: 'Popular payment method in China',
          icon: 'alipay',
          enabled: true,
          popular: false,
        },
        {
          id: 'crypto',
          name: 'Cryptocurrency',
          description: 'Pay with various cryptocurrencies',
          icon: 'crypto',
          enabled: true,
          popular: false,
        },
        {
          id: 'cashapp',
          name: 'Cash App Pay',
          description: 'Pay with Cash App',
          icon: 'cashapp',
          enabled: true,
          popular: false,
        },
        {
          id: 'amazon_pay',
          name: 'Amazon Pay',
          description: 'Pay using your Amazon account',
          icon: 'amazon-pay',
          enabled: true,
          popular: false,
        },
        {
          id: 'revolut_pay',
          name: 'Revolut Pay',
          description: 'Pay with Revolut',
          icon: 'revolut',
          enabled: true,
          popular: false,
        },
      ];

      return {
        status: true,
        message: "Available payment methods retrieved successfully",
        data: {
          paymentMethods: availableMethods,
          defaultMethod: 'multiple',
        },
      };
    } catch (error: any) {
      console.log('=== GET PAYMENT METHODS ERROR ===');
      console.log('Error:', error);
      
      return {
        status: false,
        message: error.message || "Failed to retrieve available payment methods",
      };
    }
  }

  async confirmPayment(paymentIntentId: string): Promise<PaymentResponse> {
    try {
      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === "succeeded") {
        return {
          status: true,
          message: "Payment confirmed successfully",
          data: {
            paymentIntentId: paymentIntent.id,
          },
        };
      } else {
        return {
          status: false,
          message: `Payment not successful. Current status: ${paymentIntent.status}`,
        };
      }
    } catch (error: any) {
      return {
        status: false,
        message: error.message || "Failed to confirm payment",
      };
    }
  }

  async refundPayment(
    paymentIntentId: string,
    amount?: number
  ): Promise<PaymentResponse> {
    try {
      const refundParams: any = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundParams.amount = amount * 100; // Convert to cents
      }

      const refund = await stripe.refunds.create(refundParams);

      return {
        status: true,
        message: "Refund processed successfully",
        data: {
          refundId: refund.id,
          paymentIntentId: paymentIntentId,
        },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || "Failed to process refund",
      };
    }
  }

  async processWebhookEvent(event: WebhookEvent): Promise<PaymentResponse> {
    try {
      switch (event.type) {
        case WEBHOOK_EVENTS.PAYMENT_INTENT_SUCCEEDED:
          const paymentIntent = event.data.object;
          const orderId = paymentIntent.metadata?.orderId || undefined;

          // Handle direct payments
          if (paymentIntent.metadata?.type === "direct_payment") {
            try {
              const paymentData = decompressMetadata(paymentIntent.metadata);
              const orderResult = await this.orderService.createOrder({
                customerId: paymentIntent.metadata.customerId,
                items: paymentData.items,
                totalAmount: parseFloat(paymentData.totalAmount),
                shippingAddress: paymentData.shippingAddress,
                billingAddress: paymentData.billingAddress,
                notes: paymentData.notes,
                currency: paymentData.currency,
              });

              if (orderResult.status && orderResult.data?.order) {
                // Update order with payment info
                await this.orderService.updatePaymentStatus(
                  orderResult.data.order._id,
                  PAYMENT_STATUS.PAID,
                  paymentIntent.id,
                  paymentIntent.id
                );

                return {
                  status: true,
                  message:
                    "Direct payment succeeded and order created automatically",
                  data: {
                    paymentIntentId: paymentIntent.id,
                    orderId: orderResult.data.order._id,
                  },
                };
              }
            } catch (error: any) {
              return {
                status: false,
                message: `Failed to create order from direct payment: ${error.message}`,
                data: {
                  paymentIntentId: paymentIntent.id,
                },
              };
            }
          }

          // Handle cart-based payments - create order automatically
          if (paymentIntent.metadata?.type === "cart_payment") {
            try {
              const cartData: CartPaymentMetadata = decompressMetadata(paymentIntent.metadata);
              const orderResult = await this.orderService.createOrder({
                customerId: cartData.customerId,
                items: cartData.items,
                totalAmount: cartData.totalAmount,
                shippingAddress: cartData.shippingAddress,
                billingAddress: cartData.billingAddress,
                notes: cartData.notes,
                currency: cartData.currency,
              });

              if (orderResult.status && orderResult.data?.order) {
                // Update order with payment info
                await this.orderService.updatePaymentStatus(
                  orderResult.data.order._id,
                  PAYMENT_STATUS.PAID,
                  paymentIntent.id,
                  paymentIntent.id
                );

                try {
                  await CartServices.clearUserCart(cartData.customerId);
                } catch {}

                return {
                  status: true,
                  message:
                    "Cart payment succeeded and order created automatically",
                  data: {
                    paymentIntentId: paymentIntent.id,
                    orderId: orderResult.data.order._id,
                  },
                };
              }
            } catch (error: any) {
              return {
                status: false,
                message: `Failed to create order from cart payment: ${error.message}`,
                data: {
                  paymentIntentId: paymentIntent.id,
                },
              };
            }
          }

          // Handle regular order payments
          if (orderId) {
            await this.orderService.updatePaymentStatus(
              orderId,
              PAYMENT_STATUS.PAID,
              paymentIntent.id,
              paymentIntent.id
            );
          }

          return {
            status: true,
            message: "Payment succeeded and order updated",
            data: {
              paymentIntentId: paymentIntent.id,
              orderId,
            },
          };

        case WEBHOOK_EVENTS.PAYMENT_INTENT_FAILED:
          const failedPaymentIntent = event.data.object;
          const failedOrderId =
            failedPaymentIntent.metadata?.orderId || undefined;

          if (failedOrderId) {
            await this.orderService.updatePaymentStatus(
              failedOrderId,
              PAYMENT_STATUS.FAILED,
              failedPaymentIntent.id,
              failedPaymentIntent.id
            );
          }

          return {
            status: false,
            message: "Payment failed and order updated",
            data: {
              paymentIntentId: failedPaymentIntent.id,
              orderId: failedOrderId,
            },
          };

        case WEBHOOK_EVENTS.PAYMENT_INTENT_CANCELED:
          const canceledPaymentIntent = event.data.object;
          const canceledOrderId =
            canceledPaymentIntent.metadata?.orderId || undefined;

          if (canceledOrderId) {
            await this.orderService.updatePaymentStatus(
              canceledOrderId,
              PAYMENT_STATUS.FAILED,
              canceledPaymentIntent.id,
              canceledPaymentIntent.id
            );
          }

          return {
            status: false,
            message: "Payment canceled and order updated",
            data: {
              paymentIntentId: canceledPaymentIntent.id,
              orderId: canceledOrderId,
            },
          };

        case WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED:
          const session = event.data.object;
          const sessionOrderId = session.metadata?.orderId || undefined;

          // Handle cart-based checkout sessions - create order automatically
          if (session.metadata?.type === "cart_payment") {
            try {
              const cartData: CartPaymentMetadata = decompressMetadata(session.metadata);
              const orderResult = await this.orderService.createOrder({
                customerId: cartData.customerId,
                items: cartData.items,
                totalAmount: cartData.totalAmount,
                shippingAddress: cartData.shippingAddress,
                billingAddress: cartData.billingAddress,
                notes: cartData.notes,
                currency: cartData.currency,
              });

              if (orderResult.status && orderResult.data?.order) {
                // Update order with payment info
                await this.orderService.updatePaymentStatus(
                  orderResult.data.order._id,
                  PAYMENT_STATUS.PAID,
                  session.payment_intent as string,
                  session.payment_intent as string
                );

                try {
                  await CartServices.clearUserCart(cartData.customerId);
                } catch {}

                return {
                  status: true,
                  message:
                    "Cart checkout completed and order created automatically",
                  data: {
                    paymentIntentId: session.payment_intent as string,
                    orderId: orderResult.data.order._id,
                  },
                };
              }
            } catch (error: any) {
              return {
                status: false,
                message: `Failed to create order from cart checkout: ${error.message}`,
                data: {
                  paymentIntentId: session.payment_intent as string,
                },
              };
            }
          }

          // Handle regular checkout sessions
          if (sessionOrderId && session.payment_intent) {
            await this.orderService.updatePaymentStatus(
              sessionOrderId,
              PAYMENT_STATUS.PAID,
              session.payment_intent as string,
              session.payment_intent as string
            );
          }

          return {
            status: true,
            message: "Checkout session completed and order updated",
            data: {
              sessionId: session.id,
              paymentIntentId: session.payment_intent,
              orderId: sessionOrderId,
            },
          };

        default:
          return {
            status: true,
            message: `Unhandled event type: ${event.type}`,
          };
      }
    } catch (error: any) {
      return {
        status: false,
        message: error.message || "Failed to process webhook event",
      };
    }
  }

  async createDirectPayment(
    paymentRequest: any,
    userId: string
  ): Promise<PaymentResponse> {
    try {
      // Get user's cart items from database (same as cart checkout)
      const cartResult = await CartServices.getCartByUser(userId, {});

      if (!cartResult.result || cartResult.result.length === 0) {
        return {
          status: false,
          message:
            "Your cart is empty. Please add items to your cart before proceeding.",
        };
      }

      // Calculate total amount from cart
      const totalAmount = cartResult.summary.subtotal;

      if (totalAmount <= 0) {
        return {
          status: false,
          message: "Invalid cart total. Please check your cart items.",
        };
      }

      // Transform cart items to payment items (same as cart checkout)
      const cartItems = cartResult.result.map(
        (item: CartDocument & { product_id: any }) => {
          if (!item.product_id) {
            throw new Error(`Product not found for cart item: ${item._id}`);
          }
          if (!item.product_id._id) {
            throw new Error(
              `Product ID is missing for product: ${item.product_id}`
            );
          }
          return {
            productId: item.product_id._id,
            quantity: item.quantity,
            price: item.price_at_addition,
            name: item.product_id.name || `Product ${item.product_id._id}`,
            image: item.product_id.image,
          };
        }
      );

      // Create metadata for order creation
      const paymentMetadata: any = {
        type: "direct_payment",
        customerId: userId,
        items: cartItems,
        totalAmount,
        shippingAddress: paymentRequest.shippingAddress,
        billingAddress: paymentRequest.billingAddress,
        currency: paymentRequest.currency || "usd",
        notes: paymentRequest.notes,
      };

      // Compress metadata to handle Stripe's character limits (500 chars as Stripe enforces)
      const compressedMetadata = compressMetadata(paymentMetadata, 500);

      // Create payment intent directly (no checkout session)
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(totalAmount * 100), // Convert to cents
        currency: paymentRequest.currency || "usd",
        payment_method: paymentRequest.paymentMethodId,
        confirmation_method: "manual",
        confirm: true, // Confirm immediately
        metadata: {
          type: "direct_payment",
          customerId: userId,
          ...compressedMetadata,
        },
        shipping: {
          name: `${paymentRequest.shippingAddress.street} ${paymentRequest.shippingAddress.city}`,
          address: {
            line1: paymentRequest.shippingAddress.street,
            city: paymentRequest.shippingAddress.city,
            state: paymentRequest.shippingAddress.state,
            postal_code: paymentRequest.shippingAddress.postalCode,
            country: paymentRequest.shippingAddress.country,
          },
        },
      });

      // If payment succeeds, create order immediately
      if (paymentIntent.status === "succeeded") {
        try {
          const orderResult = await this.orderService.createOrder({
            customerId: userId,
            items: cartItems,
            totalAmount,
            shippingAddress: paymentRequest.shippingAddress,
            billingAddress: paymentRequest.billingAddress,
            notes: paymentRequest.notes,
            currency: paymentRequest.currency || "usd",
          });

          if (orderResult.status && orderResult.data?.order) {
            // Update order with payment info
            await this.orderService.updatePaymentStatus(
              orderResult.data.order._id,
              PAYMENT_STATUS.PAID,
              paymentIntent.id,
              paymentIntent.id
            );

            // Clear cart after successful payment
            try {
              await CartServices.clearUserCart(userId);
            } catch {}

            return {
              status: true,
              message: "Direct payment successful and order created",
              data: {
                paymentIntentId: paymentIntent.id,
                orderId: orderResult.data.order._id,
              },
            };
          }
        } catch (error: any) {
          return {
            status: false,
            message: `Payment succeeded but failed to create order: ${error.message}`,
            data: {
              paymentIntentId: paymentIntent.id,
            },
          };
        }
      }

      return {
        status: true,
        message: "Direct payment initiated successfully",
        data: {
          paymentIntentId: paymentIntent.id,
          ...(paymentIntent.client_secret && {
            clientSecret: paymentIntent.client_secret,
          }),
          status: paymentIntent.status as string,
        },
      };
    } catch (error: any) {
      return {
        status: false,
        message: error.message || "Failed to process direct payment",
      };
    }
  }

  async constructWebhookEvent(
    payload: string | Buffer,
    signature: string | undefined
  ): Promise<WebhookEvent> {
    return stripe.webhooks.constructEvent(
      payload,
      signature || "",
      config.stripe_payment_gateway.stripe_webhook_secret || ""
    );
  }
}

export default PaymentService;
