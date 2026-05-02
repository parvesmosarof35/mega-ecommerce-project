import { Router } from "express";
import PaymentController from "./payment.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = Router();

// Cart payment routes (require authentication - user ID from JWT) 
// by card of stripe
router.post(
  "/cart/create-checkout-session",
  auth(
    USER_ROLE.guest,
    USER_ROLE.buyer,
    USER_ROLE.seller,
    USER_ROLE.admin,
    USER_ROLE.superAdmin
  ),
  PaymentController.createCartCheckoutSession
);

// by google pay stripe
router.post(
  "/cart/create-checkout-session-by-google-pay-stripe",
  auth(
    USER_ROLE.guest,
    USER_ROLE.buyer,
    USER_ROLE.seller,
    USER_ROLE.admin,
    USER_ROLE.superAdmin
  ),
  PaymentController.createGooglePayCheckoutSession
);

// by apple pay stripe
router.post(
  "/cart/create-checkout-session-by-apple-pay-stripe",
  auth(
    USER_ROLE.guest,
    USER_ROLE.buyer,
    USER_ROLE.seller,
    USER_ROLE.admin,
    USER_ROLE.superAdmin
  ),
  PaymentController.createApplePayCheckoutSession
);

// get available payment methods
router.get(
  "/available-payment-methods",
  auth(
    USER_ROLE.guest,
    USER_ROLE.buyer,
    USER_ROLE.seller,
    USER_ROLE.admin,
    USER_ROLE.superAdmin
  ),
  PaymentController.getAvailablePaymentMethods
);

// user will choose the payment method provided by stripe
router.post(
  "/cart/create-checkout-session-by-multiple-payments-stripe",
  auth(
    USER_ROLE.guest,
    USER_ROLE.buyer,
    USER_ROLE.seller,
    USER_ROLE.admin,
    USER_ROLE.superAdmin
  ),
  PaymentController.createMultiplePaymentCheckoutSession
);

// Direct payment route (require authentication - for Stripe.js frontend integration)
router.post(
  "/direct-payment",
  auth(
    USER_ROLE.guest,
    USER_ROLE.buyer,
    USER_ROLE.seller,
    USER_ROLE.admin,
    USER_ROLE.superAdmin
  ),
  PaymentController.createDirectPayment
);

// Protected routes (require authentication)
router.post(
  "/confirm-payment",
  auth(
    USER_ROLE.guest,
    USER_ROLE.buyer,
    USER_ROLE.seller,
    USER_ROLE.admin,
    USER_ROLE.superAdmin
  ),
  PaymentController.confirmPayment
);
router.post(
  "/refund",
  auth(
    USER_ROLE.guest,
    USER_ROLE.buyer,
    USER_ROLE.seller,
    USER_ROLE.admin,
    USER_ROLE.superAdmin
  ),
  PaymentController.refundPayment
);

// Webhook endpoint (no auth middleware for Stripe webhooks)
router.post("/webhook", PaymentController.webhookHandler);

export default router;
