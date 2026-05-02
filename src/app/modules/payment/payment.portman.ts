// Cart Checkout Session Postman Collection
// Import this JSON into Postman for testing cart checkout session endpoint

const cartPaymentCollection = {
  "info": {
    "_postman_id": "cart-checkout-session-collection",
    "name": "Cart Checkout Session API",
    "description": "Cart to Payment Flow - returns Stripe paymentUrl from checkout session",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Create Cart Checkout Session",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          },
          {
            "key": "Authorization",
            "value": "Bearer YOUR_JWT_TOKEN_HERE",
            "description": "User JWT token - system will get user ID and cart items from database"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": JSON.stringify({
            "shippingAddress": {
              "street": "123 Main Street",
              "city": "New York",
              "state": "NY",
              "postalCode": "10001",
              "country": "USA"
            },
            "billingAddress": {
              "street": "123 Main Street",
              "city": "New York",
              "state": "NY",
              "postalCode": "10001",
              "country": "USA"
            },
            "notes": "Please deliver after 5 PM",
            "currency": "usd"
          }, null, 2)
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/payment/cart/create-checkout-session",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "payment", "cart", "create-checkout-session"]
        }
      }
    },
    {
      "name": "Error Example - Missing Shipping Address",
      "request": {
        "method": "POST",
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
            "notes": "Please deliver after 5 PM"
          }, null, 2)
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/payment/cart/create-checkout-session",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "payment", "cart", "create-checkout-session"]
        }
      }
    },
    {
      "name": "Error Example - No Auth Token",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": JSON.stringify({
            "shippingAddress": {
              "street": "123 Main Street",
              "city": "New York",
              "state": "NY",
              "postalCode": "10001",
              "country": "USA"
            }
          }, null, 2)
        },
        "url": {
          "raw": "{{baseUrl}}/api/v1/payment/cart/create-checkout-session",
          "host": ["{{baseUrl}}"],
          "path": ["api", "v1", "payment", "cart", "create-checkout-session"]
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

// Usage Instructions:
// 1. Copy the JSON above
// 2. Open Postman
// 3. Click Import > Raw text
// 4. Paste the JSON and import
// 5. Update the baseUrl variable if needed
// 6. Replace YOUR_JWT_TOKEN_HERE with actual JWT token from your authentication

// Flow:
// 1. User adds products to cart (separate cart endpoints)
// 2. User sends only addresses to cart checkout session endpoint with JWT token
// 3. System fetches cart items and user ID from database
// 4. System creates Stripe checkout session
// 5. User gets paymentUrl to complete payment
// 6. After successful payment, webhook automatically creates order

// Success Response Format:
// {
//   "success": true,
//   "message": "Cart checkout session created successfully",
//   "data": {
//     "sessionId": "cs_test_...",
//     "paymentUrl": "https://checkout.stripe.com/c/pay/..."
//   }
// }

// Error Response Format:
// {
//   "success": false,
//   "message": "Zod Validation error",
//   "data": null,
//   "errorSources": [
//     {
//       "path": "shippingAddress",
//       "message": "Street is required"
//     }
//   ]
// }

export default cartPaymentCollection;