# Payment & Order System API Documentation

This system provides a complete backend-only payment solution using Stripe for order processing and payment handling.

## Overview

The system consists of two main modules:

- **Order Module**: Manages order creation, status tracking, and order lifecycle
- **Payment Module**: Handles Stripe payment processing, webhooks, and payment status updates

## API Endpoints

### Order Management

#### Create Order

```http
POST /api/v1/order/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "customerId": "user_123",
  "items": [
    {
      "productId": "prod_123",
      "quantity": 2,
      "price": 29.99,
      "name": "Product Name",
      "image": "https://example.com/image.jpg"
    }
  ],
  "totalAmount": 59.98,
  "shippingAddress": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "postalCode": "10001",
    "country": "USA"
  },
  "currency": "usd"
}
```

#### Get Order by ID

```http
GET /api/v1/order/:orderId
Authorization: Bearer <token>
```

#### Get Customer Orders

```http
GET /api/v1/order/my-orders/:customerId?page=1&limit=10
Authorization: Bearer <token>
```

#### Get All Orders (Admin)

```http
GET /api/v1/order?page=1&limit=10&status=pending&paymentStatus=pending
Authorization: Bearer <token>
```

#### Update Order Status (Admin)

```http
PATCH /api/v1/order/:orderId/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "confirmed",
  "notes": "Order confirmed and ready for processing"
}
```

#### Cancel Order

```http
PATCH /api/v1/order/:orderId/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Customer requested cancellation"
}
```

### Payment Processing

#### Create Payment Intent

```http
POST /api/v1/payment/create-payment-intent
Content-Type: application/json

{
  "amount": 59.98,
  "currency": "usd",
  "orderId": "order_123",
  "customerId": "user_123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Payment intent created successfully",
  "data": {
    "clientSecret": "pi_123_secret_123",
    "paymentIntentId": "pi_123"
  }
}
```

#### Create Checkout Session (Redirect-based Payment)

```http
POST /api/v1/payment/create-checkout-session
Content-Type: application/json

{
  "orderId": "order_123",
  "amount": 59.98,
  "currency": "usd",
  "customerId": "user_123"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Checkout session created successfully",
  "data": {
    "sessionId": "cs_123",
    "paymentUrl": "https://checkout.stripe.com/pay/cs_123"
  }
}
```

#### Confirm Payment

```http
POST /api/v1/payment/confirm-payment
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentIntentId": "pi_123"
}
```

#### Retrieve Payment Intent

```http
GET /api/v1/payment/retrieve-payment-intent/:paymentIntentId
```

#### Process Refund

```http
POST /api/v1/payment/refund
Authorization: Bearer <token>
Content-Type: application/json

{
  "paymentIntentId": "pi_123",
  "amount": 29.99,
  "reason": "Customer requested refund"
}
```

#### Webhook Handler

```http
POST /api/v1/payment/webhook
Headers: Stripe-Signature: <signature>
Content-Type: application/json

// Stripe sends webhook events automatically
```

## Payment Flow

### Method 1: Payment Intent (Client-side Integration)

1. Create an order using `/order/create`
2. Create a payment intent using `/payment/create-payment-intent`
3. Use the `clientSecret` on your frontend with Stripe.js
4. Stripe handles the payment, sends webhook to update order status

### Method 2: Checkout Session (Redirect-based)

1. Create an order using `/order/create`
2. Create a checkout session using `/payment/create-checkout-session`
3. Redirect user to the `paymentUrl` returned
4. User completes payment on Stripe's hosted page
5. Stripe redirects to success/cancel URLs and sends webhook

## Webhook Configuration

1. Set up your Stripe webhook endpoint: `https://yourdomain.com/api/v1/payment/webhook`
2. Configure these events in your Stripe dashboard:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `payment_intent.canceled`
   - `checkout.session.completed`

## Order Status Flow

```
pending -> confirmed -> processing -> shipped -> delivered
    \-> cancelled
```

## Payment Status Flow

```
pending -> paid -> refunded
    \-> failed
```

## Environment Variables

Make sure these are configured in your `.env` file:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
ONBOARDING_REFRESH_URL=http://localhost:5000/stripe/refresh
ONBOARDING_RETURN_URL=http://localhost:5000/stripe/return
CHECKOUT_SUCCESS_URL=http://localhost:3000/success
CHECKOUT_CANCEL_URL=http://localhost:3000/cancel
```

## Testing with Stripe CLI

For local testing, use the Stripe CLI:

```bash
# Forward webhooks to your local server
stripe listen --forward-to localhost:5000/api/v1/payment/webhook

# Test events
stripe trigger payment_intent.succeeded
stripe trigger payment_intent.payment_failed
stripe trigger checkout.session.completed
```

## Error Handling

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information (in development)"
}
```

## Security Notes

- All payment-related endpoints except webhooks require authentication
- Webhook signature verification is implemented
- Order amounts are validated against payment amounts
- Payment status updates are automatically synced with order status
