// Cart API Postman Documentation
// Base URL: http://localhost:5000/api/v1/cart

// ## **POST /api/v1/cart - Add Product to Cart**

// ### **Request Setup:**
// - **Method**: `POST`
// - **URL**: `http://localhost:5000/api/v1/cart`
// - **Headers**: 
//   - `Authorization`: `Bearer YOUR_AUTH_TOKEN`
//   - `Content-Type`: `application/json`

// ### **Request Body:**
// ```json
// {
//   "product_id": "693f50ef5d1369fb4541f814",
//   "quantity": 2
// }
// ```

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 201,
//   "success": true,
//   "message": "Product added to cart successfully",
//   "data": {
//     "_id": "...",
//     "user_id": "USER_ID_FROM_TOKEN",
//     "product_id": {
//       "_id": "693f50ef5d1369fb4541f814",
//       "name": "skin new Complex",
//       "price": 89.99,
//       "images_urls": ["..."],
//       "stock_quantity": 100
//     },
//     "quantity": 2,
//     "price_at_addition": 89.99,
//     "isDelete": false,
//     "createdAt": "...",
//     "updatedAt": "..."
//   }
// }
// ```

// ### **If Product Already in Cart:**
// ```json
// {
//   "statusCode": 201,
//   "success": true,
//   "message": "Product added to cart successfully",
//   "data": {
//     "_id": "...",
//     "quantity": 3,
//     "price_at_addition": 89.99
//   }
// }
// ```

// ---

// ## **GET /api/v1/cart - Get My Cart**

// ### **Request Setup:**
// - **Method**: `GET`
// - **URL**: `http://localhost:5000/api/v1/cart`
// - **Headers**: 
//   - `Authorization`: `Bearer YOUR_AUTH_TOKEN`

// ### **Query Parameters (Optional):**
// ```
// ?limit=10&page=1&sort=createdAt&searchTerm=product
// ```

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Cart retrieved successfully",
//   "meta": {
//     "page": 1,
//     "limit": 10,
//     "total": 3,
//     "totalPage": 1
//   },
//   "data": {
//     "items": [
//       {
//         "_id": "...",
//         "user_id": "USER_ID",
//         "product_id": {
//           "_id": "693f50ef5d1369fb4541f814",
//           "name": "skin new Complex",
//           "price": 89.99,
//           "images_urls": ["..."],
//           "stock_quantity": 100
//         },
//         "quantity": 2,
//         "price_at_addition": 89.99,
//         "createdAt": "..."
//       }
//     ],
//     "summary": {
//       "subtotal": 179.98,
//       "totalItems": 2,
//       "itemCount": 1
//     }
//   }
// }
// ```

// ---

// ## **GET /api/v1/cart/summary - Get Cart Summary**

// ### **Request Setup:**
// - **Method**: `GET`
// - **URL**: `http://localhost:5000/api/v1/cart/summary` no need of this route
// - **Headers**: 
//   - `Authorization**: `Bearer YOUR_AUTH_TOKEN`

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Cart summary retrieved successfully",
//   "data": {
//     "subtotal": 179.98,
//     "totalItems": 2,
//     "itemCount": 1,
//     "items": [
//       {
//         "id": "...",
//         "product_id": "693f50ef5d1369fb4541f814",
//         "product_name": "skin new Complex",
//         "quantity": 2,
//         "price": 89.99,
//         "subtotal": 179.98
//       }
//     ]
//   }
// }
// ```

// ---

// ## **GET /api/v1/cart/check/:productId - Check if Product in Cart**

// ### **Request Setup:**
// - **Method**: `GET`
// - **URL**: `http://localhost:5000/api/v1/cart/check/693f50ef5d1369fb4541f814`
// - **Headers**: 
//   - `Authorization`: `Bearer YOUR_AUTH_TOKEN`

// ### **Expected Response (Product in Cart):**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Product found in cart",
//   "data": {
//     "isInCart": true,
//     "cartItem": {
//       "_id": "...",
//       "user_id": "USER_ID",
//       "product_id": {
//         "_id": "693f50ef5d1369fb4541f814",
//         "name": "skin new Complex"
//       },
//       "quantity": 2,
//       "price_at_addition": 89.99,
//       "createdAt": "..."
//     }
//   }
// }
// ```

// ### **Expected Response (Product Not in Cart):**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Product not in cart",
//   "data": {
//     "isInCart": false,
//     "cartItem": null
//   }
// }
// ```

// ---

// ## **PUT /api/v1/cart/product/:productId - Update Cart Item Quantity**

// ### **Request Setup:**
// - **Method**: `PUT`
// - **URL**: `http://localhost:5000/api/v1/cart/product/693f50ef5d1369fb4541f814`
// - **Headers**: 
//   - `Authorization`: `Bearer YOUR_AUTH_TOKEN`
//   - `Content-Type`: `application/json`

// ### **Request Body:**
// ```json
// {
//   "quantity": 5
// }
// ```

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Cart item quantity updated successfully",
//   "data": {
//     "_id": "CART_ITEM_ID",
//     "user_id": "USER_ID",
//     "product_id": {
//       "_id": "693f50ef5d1369fb4541f814",
//       "name": "skin new Complex",
//       "price": 89.99
//     },
//     "quantity": 5,
//     "price_at_addition": 89.99,
//     "updatedAt": "..."
//   }
// }
// ```

// ### **If quantity is 0 or negative:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Product removed from cart successfully",
//   "data": {
//     "_id": "CART_ITEM_ID",
//     "user_id": "USER_ID",
//     "product_id": "693f50ef5d1369fb4541f814",
//     "quantity": 2,
//     "price_at_addition": 89.99,
//     "updatedAt": "..."
//   }
// }
// ```

// ---

// ## **DELETE /api/v1/cart/product/:productId - Remove Product from Cart**

// ### **Request Setup:**
// - **Method**: `DELETE`
// - **URL**: `http://localhost:5000/api/v1/cart/product/693f50ef5d1369fb4541f814`
// - **Headers**: 
//   - `Authorization**: `Bearer YOUR_AUTH_TOKEN`

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Product removed from cart successfully",
//   "data": {
//     "_id": "...",
//     "user_id": "USER_ID",
//     "product_id": "693f50ef5d1369fb4541f814",
//     "quantity": 2,
//     "price_at_addition": 89.99,
//     "isDelete": true,
//     "updatedAt": "..."
//   }
// }
// ```

// ---

// ## **DELETE /api/v1/cart/:id - Delete Cart Item by ID**

// ### **Request Setup:**
// - **Method**: `DELETE`
// - **URL**: `http://localhost:5000/api/v1/cart/CART_ITEM_ID`
// - **Headers**: 
//   - `Authorization**: `Bearer YOUR_AUTH_TOKEN`

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Cart item deleted successfully",
//   "data": {
//     "_id": "CART_ITEM_ID",
//     "user_id": "USER_ID",
//     "product_id": "693f50ef5d1369fb4541f814",
//     "isDelete": true,
//     "updatedAt": "..."
//   }
// }
// ```

// ---

// ## **DELETE /api/v1/cart/clear - Clear Entire Cart**

// ### **Request Setup:**
// - **Method**: `DELETE`
// - **URL**: `http://localhost:5000/api/v1/cart/clear`
// - **Headers**: 
//   - `Authorization**: `Bearer YOUR_AUTH_TOKEN`

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Cart cleared successfully",
//   "data": {
//     "deletedCount": 3,
//     "message": "3 items removed from cart"
//   }
// }
// ```

// ---

// ## **Important Notes:**

// 1. **Authentication**: All endpoints require a valid JWT token in the Authorization header
// 2. **User Roles**: Accessible by buyers, sellers, admins, and superAdmins
// 3. **Product ID**: Use valid MongoDB ObjectId for product_id parameters
// 4. **Stock Validation**: Cart operations validate product stock availability
// 5. **Price Locking**: Price is locked when item is added to cart (price_at_addition)
// 6. **Soft Delete**: Removed items are soft deleted (isDelete: true) and not returned in normal queries
// 7. **Unique Constraint**: Each user can only have one cart item per product
// 8. **Pagination**: Use limit, page, sort, and searchTerm query parameters for filtering and pagination
// 9. **Quantity Limits**: Minimum quantity is 1, no maximum limit (subject to stock availability)

// ## **Business Logic:**

// 1. **Add to Cart**: 
//    - If product already exists in cart, increases quantity
//    - Updates price to current product price
//    - Validates stock availability
//    - Returns updated cart item

// 2. **Update Quantity**:
//    - Validates stock availability for new quantity
//    - Updates only the quantity, not the price
//    - Requires cart item ownership verification

// 3. **Cart Summary**:
//    - Calculates subtotal (price × quantity for all items)
//    - Counts total items (sum of quantities)
//    - Counts unique items (number of different products)

// ## **Common Error Responses:**

// ### **Unauthorized (401):**
// ```json
// {
//   "statusCode": 401,
//   "success": false,
//   "message": "Unauthorized access"
// }
// ```

// ### **Product Not Found (404):**
// ```json
// {
//   "statusCode": 404,
//   "success": false,
//   "message": "Product not found"
// }
// ```

// ### **Insufficient Stock (400):**
// ```json
// {
//   "statusCode": 400,
//   "success": false,
//   "message": "Insufficient stock"
// }
// ```

// ### **Cart Item Not Found (404):**
// ```json
// {
//   "statusCode": 404,
//   "success": false,
//   "message": "Cart item not found or unauthorized"
// }
// ```

// ### **Invalid Quantity (400):**
// ```json
// {
//   "statusCode": 400,
//   "success": false,
//   "message": "Quantity must be at least 1"
// }
// ```
