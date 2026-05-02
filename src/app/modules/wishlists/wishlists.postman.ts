// Wishlist API Postman Documentation
// Base URL: http://localhost:5000/api/v1/wishlist

// ## **POST /api/v1/wishlist - Add Product to Wishlist**

// ### **Request Setup:**
// - **Method**: `POST`
// - **URL**: `http://localhost:5000/api/v1/wishlist`
// - **Headers**: 
//   - `Authorization`: `Bearer YOUR_AUTH_TOKEN`
//   - `Content-Type`: `application/json`

// ### **Request Body:**
// ```json
// {
//   "product_id": "693f50ef5d1369fb4541f814"
// }
// ```

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 201,
//   "success": true,
//   "message": "Product added to wishlist successfully",
//   "data": {
//     "_id": "...",
//     "user_id": "USER_ID_FROM_TOKEN",
//     "product_id": "693f50ef5d1369fb4541f814",
//     "isDelete": false,
//     "createdAt": "...",
//     "updatedAt": "..."
//   }
// }
// ```

// ---

// ## **GET /api/v1/wishlist/my-wishlist - Get My Wishlist**

// ### **Request Setup:**
// - **Method**: `GET`
// - **URL**: `http://localhost:5000/api/v1/wishlist/my-wishlist`
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
//   "message": "Wishlist retrieved successfully",
//   "meta": {
//     "page": 1,
//     "limit": 10,
//     "total": 5,
//     "totalPage": 1
//   },
//   "data": [
//     {
//       "_id": "...",
//       "user_id": "USER_ID",
//       "product_id": {
//         "_id": "693f50ef5d1369fb4541f814",
//         "name": "skin new Complex",
//         "price": 89.99,
//         "images_urls": ["..."],
//         "averageRating": 4.25,
//         "totalReviews": 4
//       },
//       "isDelete": false,
//       "createdAt": "...",
//       "updatedAt": "..."
//     }
//   ]
// }
// ```

// ---

// ## **GET /api/v1/wishlist/check/:productId - Check if Product in Wishlist**

// ### **Request Setup:**
// - **Method**: `GET`
// - **URL**: `http://localhost:5000/api/v1/wishlist/check/693f50ef5d1369fb4541f814`
// - **Headers**: 
//   - `Authorization`: `Bearer YOUR_AUTH_TOKEN`

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Wishlist check completed",
//   "data": {
//     "isInWishlist": true,
//     "wishlistItem": {
//       "_id": "...",
//       "user_id": "USER_ID",
//       "product_id": "693f50ef5d1369fb4541f814",
//       "createdAt": "..."
//     }
//   }
// }
// ```

// ### **If Product Not in Wishlist:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Product not found in wishlist",
//   "data": {
//     "isInWishlist": false
//   }
// }
// ```

// ---

// ## **DELETE /api/v1/wishlist/product/:productId - Remove Product from Wishlist**

// ### **Request Setup:**
// - **Method**: `DELETE`
// - **URL**: `http://localhost:5000/api/v1/wishlist/product/693f50ef5d1369fb4541f814`
// - **Headers**: 
//   - `Authorization`: `Bearer YOUR_AUTH_TOKEN`

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Product removed from wishlist successfully",
//   "data": {
//     "_id": "...",
//     "user_id": "USER_ID",
//     "product_id": "693f50ef5d1369fb4541f814",
//     "isDelete": true,
//     "updatedAt": "..."
//   }
// }
// ```

// ---

// ## **DELETE /api/v1/wishlist/clear - Clear Entire Wishlist**

// ### **Request Setup:**
// - **Method**: `DELETE`
// - **URL**: `http://localhost:5000/api/v1/wishlist/clear`
// - **Headers**: 
//   - `Authorization`: `Bearer YOUR_AUTH_TOKEN`

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Wishlist cleared successfully",
//   "data": {
//     "deletedCount": 5,
//     "message": "All items removed from wishlist"
//   }
// }
// ```

// ---

// ## **GET /api/v1/wishlist/count - Get Wishlist Count**

// ### **Request Setup:**
// - **Method**: `GET`
// - **URL**: `http://localhost:5000/api/v1/wishlist/count`
// - **Headers**: 
//   - `Authorization`: `Bearer YOUR_AUTH_TOKEN`

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Wishlist count retrieved successfully",
//   "data": {
//     "count": 5,
//     "message": "Total items in wishlist"
//   }
// }
// ```

// ---

// ## **Important Notes:**

// 1. **Authentication**: All endpoints require a valid JWT token in the Authorization header
// 2. **User Roles**: Accessible by buyers, sellers, admins, and superAdmins
// 3. **Product ID**: Use valid MongoDB ObjectId for product_id parameters
// 4. **Soft Delete**: Removed items are soft deleted (isDelete: true) and not returned in normal queries
// 5. **Pagination**: Use limit, page, sort, and searchTerm query parameters for filtering and pagination
// 6. **Error Handling**: 401 for unauthorized, 404 for not found, 400 for bad requests

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

// ### **Already in Wishlist (400):**
// ```json
// {
//   "statusCode": 400,
//   "success": false,
//   "message": "Product already in wishlist"
// }
// ```