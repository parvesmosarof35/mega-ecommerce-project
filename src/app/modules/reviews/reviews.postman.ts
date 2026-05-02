// Let me check the reviews route and interface to understand how the review system works:

// Based on the review system, here's how to use it in Postman:

// ## **POST /api/v1/review - Create Review**

// ### **Request Setup:**
// - **Method**: `POST`
// - **URL**: `http://localhost:5000/api/v1/review`
// - **Headers**: 
//   - `Authorization`: `Bearer YOUR_AUTH_TOKEN`
//   - `Content-Type`: `application/json`

// ### **Request Body:**
// ```json
// {
//   "product_id": "693f426af105d120a6b1be98",
//   "rating": 5,
//   "comment": "Excellent product! Highly recommended."
// }
// ```

// **Note:** `user_id` is automatically added from the authenticated user.

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 201,
//   "success": true,
//   "message": "Review created successfully",
//   "data": {
//     "product_id": "693f426af105d120a6b1be98",
//     "user_id": "USER_ID_FROM_TOKEN",
//     "rating": 5,
//     "comment": "Excellent product! Highly recommended.",
//     "_id": "...",
//     "createdAt": "...",
//     "updatedAt": "..."
//   }
// }
// ```

// ---

// ## **GET /api/v1/review/product/:productId - Get Reviews by Product**

// ### **Request Setup:**
// - **Method**: `GET`
// - **URL**: `http://localhost:5000/api/v1/review/product/693f426af105d120a6b1be98`
// - **Headers**: No authentication required (public endpoint)

// ### **Query Parameters (Optional):**
// ```
// ?limit=10&page=1&sort=rating&searchTerm=excellent
// ```

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Reviews retrieved successfully",
//   "meta": {
//     "page": 1,
//     "limit": 10,
//     "total": 5,
//     "totalPage": 1
//   },
//   "data": [
//     {
//       "_id": "...",
//       "product_id": "693f426af105d120a6b1be98",
//       "user_id": "...",
//       "rating": 5,
//       "comment": "Excellent product! Highly recommended.",
//       "isDelete": false,
//       "createdAt": "...",
//       "updatedAt": "..."
//     }
//   ]
// }
// ```

// ---

// ## **Other Available Endpoints:**

// - **GET /api/v1/review/user/:userId** - Get reviews by user
// - **GET /api/v1/review/average-rating/:productId** - Get average rating for product
// - **PUT /api/v1/review/:id** - Update review (requires auth)
// - **DELETE /api/v1/review/:id** - Delete review (requires auth)

// The review system automatically links reviews to both products and users, with rating validation (1-5 stars) and soft delete functionality.