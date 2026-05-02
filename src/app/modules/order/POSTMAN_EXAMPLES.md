# Order Management API - Postman Examples

## Admin Order Management Routes

### 1. Update Order Status

**PATCH** `/api/v1/order/:orderId/status`

**Headers:**

- Authorization: Bearer `<admin_jwt_token>`

**Body (raw JSON):**

```json
{
  "status": "confirmed",
  "notes": "Order confirmed and ready for processing"
}
```

**Status Options:**

- `pending` - Order received but not yet confirmed
- `confirmed` - Order confirmed by admin
- `processing` - Order is being processed
- `shipped` - Order has been shipped
- `delivered` - Order has been delivered
- `cancelled` - Order has been cancelled

**Example Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Order status updated successfully",
  "data": {
    "order": {
      "_id": "64a1b2c3d4e5f6789012345",
      "status": "confirmed",
      "notes": "Order confirmed and ready for processing",
      "updatedAt": "2023-07-01T10:30:00.000Z"
    }
  }
}
```

---

### 2. Update Payment Status

**PATCH** `/api/v1/order/:orderId/payment-status`

**Headers:**

- Authorization: Bearer `<admin_jwt_token>`

**Body (raw JSON):**

```json
{
  "paymentStatus": "paid",
  "paymentIntentId": "pi_1234567890abcdef",
  "stripePaymentId": "py_1234567890abcdef"
}
```

**Payment Status Options:**

- `pending` - Payment is pending
- `paid` - Payment completed successfully
- `failed` - Payment failed
- `refunded` - Payment was refunded

**Example Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Payment status updated successfully",
  "data": {
    "order": {
      "_id": "64a1b2c3d4e5f6789012345",
      "paymentStatus": "paid",
      "paymentIntentId": "pi_1234567890abcdef",
      "stripePaymentId": "py_1234567890abcdef",
      "updatedAt": "2023-07-01T10:30:00.000Z"
    }
  }
}
```

---

### 3. Cancel Order

**PATCH** `/api/v1/order/:orderId/cancel`

**Headers:**

- Authorization: Bearer `<admin_jwt_token>`

**Body (raw JSON):**

```json
{
  "reason": "Customer requested cancellation due to change of mind"
}
```

**Example Response:**

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Order cancelled successfully",
  "data": {
    "order": {
      "_id": "64a1b2c3d4e5f6789012345",
      "status": "cancelled",
      "cancellationReason": "Customer requested cancellation due to change of mind",
      "cancelledAt": "2023-07-01T10:30:00.000Z",
      "updatedAt": "2023-07-01T10:30:00.000Z"
    }
  }
}
```

---

## Usage Notes

1. **Authentication**: All these routes require admin authentication. Include a valid JWT token in the Authorization header.

2. **Order ID**: Replace `:orderId` in the URL with the actual order ID you want to update.

3. **Status Updates**:
   - When updating order status, you can optionally include notes for internal tracking
   - When updating payment status, include payment intent and Stripe payment IDs when available

4. **Error Handling**:
   - If the order is not found, you'll get a 404 response
   - If validation fails, you'll get a 400 response with error details
   - If you're not authorized, you'll get a 401 or 403 response

5. **Common Workflows**:
   - **Payment Received**: Update payment status to "paid" → Update order status to "confirmed"
   - **Order Processing**: Update order status to "processing" → "shipped" → "delivered"
   - **Order Issues**: Update order status to "cancelled" with appropriate reason
