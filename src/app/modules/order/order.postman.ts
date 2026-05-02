// Order API Postman Collection
// Import this JSON into Postman for testing order endpoints

const orderCollection = {
  "info": {
    "_postman_id": "order-api-collection",
    "name": "Order API (Admin Management)",
    "description": "Admin Order Management API endpoints with example payloads",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Update Order Status (Admin)",
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer YOUR_JWT_TOKEN_HERE"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": JSON.stringify({
            "status": "shipped",
            "notes": "Package shipped via FedEx, tracking #12345"
          }, null, 2)
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/order/order_12345/status",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "order", "order_12345", "status"]
        },
        "description": "Allowed status values: 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'"
      }
    },
    {
      "name": "Update Payment Status (Admin)",
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer YOUR_JWT_TOKEN_HERE"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": JSON.stringify({
            "paymentStatus": "paid",
            "paymentIntentId": "pi_3MtwMdLkdIwHu7ix28a3tqPa",
            "stripePaymentId": "pi_3MtwMdLkdIwHu7ix28a3tqPa"
          }, null, 2)
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/order/order_12345/payment-status",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "order", "order_12345", "payment-status"]
        },
        "description": "Allowed paymentStatus values: 'pending', 'paid', 'failed', 'refunded'"
      }
    },
    {
      "name": "Cancel Order",
      "request": {
        "method": "PATCH",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer YOUR_JWT_TOKEN_HERE"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": JSON.stringify({
            "reason": "Customer requested cancellation via phone"
          }, null, 2)
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/order/order_12345/cancel",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "order", "order_12345", "cancel"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000",
      "type": "string"
    }
  ]
};

// Valid Enums Reference:
// Order Status: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
// Payment Status: ['pending', 'paid', 'failed', 'refunded']

export default orderCollection;