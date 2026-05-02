// Products API Postman Documentation
// Base URL: http://localhost:5000/api/v1/products

// ## **POST /api/v1/products - Create Product** done

// ### **Request Setup:**
// - **Method**: `POST`
// - **URL**: `http://localhost:5000/api/v1/products`
// - **Headers**:
//   - `Authorization`: `Bearer YOUR_ADMIN_TOKEN`
//   - `Content-Type`: `multipart/form-data`

// ### **Form Data Fields:**
// - **data** (JSON string):
// ```json
// {
//   "name": "Advanced Vitamin C Serum",
//   "description": "Potent vitamin C serum with hyaluronic acid for brightening and hydration",
//   "price": "89.99",
//   "stock_quantity": "50",
//   "sku": "VITC-SERUM-001",
//   "isFeatured": true,
//   "categories": ["Serums", "Vitamin C", "Anti-aging"],
//   "skintype": "Normal",
//   "skintype": "Normal",
//   "ingredients": ["Vitamin C", "Hyaluronic Acid"],
//   "product_link": "https://example.com/product",
//   "collections": ["COLLECTION_ID_HERE"]
// }
// ```
// - **images**: File upload (up to 8 images)

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 201,
//   "success": true,
//   "message": "Product created successfully",
//   "data": {
//     "_id": "...",
//     "name": "Advanced Vitamin C Serum",
//     "description": "Potent vitamin C serum with hyaluronic acid for brightening and hydration",
//     "price": 89.99,
//     "stock_quantity": 50,
//     "sku": "VITC-SERUM-001",
//     "isFeatured": true,
//     "images_urls": ["uploads/image1.jpg", "uploads/image2.jpg"],
//     "categories": ["Serums", "Vitamin C", "Anti-aging"],
//     "skintype": "Normal",
//     "ingredients": ["Vitamin C", "Hyaluronic Acid"],
//     "collections": ["COLLECTION_ID_HERE"],
//     "createdAt": "...",
//     "updatedAt": "..."
//   }
// }
// ```

// ---

// ## **GET /api/v1/products - Get All Products** done

// ### **Request Setup:**
// - **Method**: `GET`
// - **URL**: `http://localhost:5000/api/v1/products`
// - **Headers**:
//   - `Content-Type`: `application/json`

// ### **Query Parameters (Optional):**
// ```
// ?limit=10&page=1&sort=priceLowToHigh&searchTerm=serum&categories=Serums&skintype=Normal&ingredients=Hyaluronic Acid,Vitamin C&collections=60f1b2b3c4d5e6f7g8h9i0j1&isFeatured=true
// ```

// ### **Sorting Options:**
// - **bestSelling**: Sort by stock quantity (high to low)
// - **bestRating**: Sort by average rating (high to low)
// - **priceLowToHigh**: Sort by price (low to high)
// - **priceHighToLow**: Sort by price (high to low)
// - **newest**: Sort by creation date (newest first)
// - **oldest**: Sort by creation date (oldest first)

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Products retrieved successfully",
//   "meta": {
//     "page": 1,
//     "limit": 10,
//     "total": 25,
//     "totalPage": 3
//   },
//   "data": [
//     {
//       "_id": "...",
//       "name": "Advanced Vitamin C Serum",
//       "description": "...",
//       "price": 89.99,
//       "stock_quantity": 50,
//       "sku": "VITC-SERUM-001",
//       "isFeatured": true,
//       "images_urls": ["..."],
//       "categories": ["Serums", "Vitamin C"],
//       "skintype": "Normal",
//       "ingredients": ["Vitamin C", "Hyaluronic Acid"],
//       "averageRating": 4.5,
//       "totalReviews": 128,
//       "createdAt": "..."
//     }
//   ]
// }
// ```

// ---

// ## **GET /api/v1/products/:id - Get Single Product** done

// ### **Request Setup:**
// - **Method**: `GET`
// - **URL**: `http://localhost:5000/api/v1/products/PRODUCT_ID_HERE`
// - **Headers**:
//   - `Content-Type`: `application/json`

// ### **Query Parameters (Optional for Reviews):**
// ```
// ?limit=5&page=1&sort=-createdAt
// ```

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Product retrieved successfully",
//   "data": {
//     "_id": "...",
//     "name": "Advanced Vitamin C Serum",
//     "description": "...",
//     "price": 89.99,
//     "stock_quantity": 50,
//     "sku": "VITC-SERUM-001",
//     "isFeatured": true,
//     "images_urls": ["..."],
//     "categories": ["Serums", "Vitamin C"],
//     "skintype": "Normal",
//     "ingredients": ["Vitamin C", "Hyaluronic Acid"],
//     "collections": [{"_id": "...", "name": "Best Sellers"}],
//     "averageRating": 4.5,
//     "totalReviews": 128,
//     "reviews": [
//       {
//         "_id": "...",
//         "rating": 5,
//         "comment": "Amazing product!",
//         "user": {...},
//         "createdAt": "..."
//       }
//     ],
//     "reviewsMeta": {
//       "page": 1,
//       "limit": 5,
//       "total": 128,
//       "totalPage": 26
//     },
//     "createdAt": "..."
//   }
// }
// ```

// ---

// ## **PUT /api/v1/products/:id - Update Product** done

// ### **Request Setup:**
// - **Method**: `PUT`
// - **URL**: `http://localhost:5000/api/v1/products/PRODUCT_ID_HERE`
// - **Headers**:
//   - `Authorization`: `Bearer YOUR_ADMIN_TOKEN`
//   - `Content-Type`: `application/json`

// ### **Request Body:**
// ```json
// {
//   "name": "Updated Vitamin C Serum",
//   "price": "79.99",
//   "stock_quantity": "75",
//   "isFeatured": false,
//   "categories": ["Serums", "Updated Category"],
//   "skintype": "Oily",
//   "skintype": "Oily",
//   "ingredients": ["Vitamin C", "Niacinamide"],
//   "product_link": "https://example.com/updated-product"
// }
// ```

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Product updated successfully",
//   "data": {
//     "_id": "...",
//     "name": "Updated Vitamin C Serum",
//     "description": "...",
//     "price": 79.99,
//     "stock_quantity": 75,
//     "sku": "VITC-SERUM-001",
//     "isFeatured": false,
//     "categories": ["Serums", "Updated Category"],
//     "skintype": "Oily",
//     "ingredients": ["Vitamin C", "Niacinamide"],
//     "updatedAt": "..."
//   }
// }
// ```

// ---

// ## **DELETE /api/v1/products/:id - Delete Product**

// ### **Request Setup:**
// - **Method**: `DELETE`
// - **URL**: `http://localhost:5000/api/v1/products/PRODUCT_ID_HERE`
// - **Headers**:
//   - `Authorization`: `Bearer YOUR_ADMIN_TOKEN`

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Product deleted successfully",
//   "data": {
//     "_id": "...",
//     "name": "Advanced Vitamin C Serum",
//     "sku": "VITC-SERUM-001",
//     "price": 89.99,
//     "createdAt": "...",
//     "updatedAt": "..."
//   }
// }
// ```

// ---

// ## **GET /api/v1/products/collection/:collectionId - Get Products by Collection** done

// ### **Request Setup:**
// - **Method**: `GET`
// - **URL**: `http://localhost:5000/api/v1/products/collection/COLLECTION_ID_HERE`
// - **Headers**:
//   - `Content-Type`: `application/json`

// ### **Query Parameters (Optional):**
// ```
// ?limit=10&page=1&sort=price&searchTerm=serum
// ```

// ### **Expected Response:**
// ```json
// {
//   "statusCode": 200,
//   "success": true,
//   "message": "Products retrieved successfully by collection",
//   "meta": {
//     "page": 1,
//     "limit": 10,
//     "total": 8,
//     "totalPage": 1
//   },
//   "data": [
//     {
//       "_id": "...",
//       "name": "Advanced Vitamin C Serum",
//       "price": 89.99,
//       "stock_quantity": 50,
//       "sku": "VITC-SERUM-001",
//       "isFeatured": true,
//       "collections": ["COLLECTION_ID_HERE"],
//       "averageRating": 4.5,
//       "totalReviews": 128
//     }
//   ]
// }
// ```

// ---

// ## **Important Notes:**

// - **name**: Required
// - **description**: Optional
// - **price**: Required
// - **sku**: Optional, unique, automatically converted to uppercase if provided
// - **stock_quantity**: Optional number (minimum 0)
// - **isFeatured**: Optional boolean, defaults to false
// - **skintype**: Optional single value (case-sensitive) from: ["Dry", "Oily", "Combination", "Sensitive", "Normal"]
// - **ingredients**: Optional array (case-sensitive) from: ["Hyaluronic Acid", "Vitamin C", "Retinol", "Niacinamide", "Peptides"]
// - **categories**: Optional array of strings
// - **collections**: Optional array of collection ObjectIds
// - **images**: Optional, max 8 images, file upload

// ### **Authentication:**
// - **Admin/SuperAdmin only**: POST, PUT, DELETE operations
// - **Public access**: GET operations

// ### **Business Logic:**
// - **Hard Delete**: DELETE operation permanently removes products
// - **SKU Validation**: If provided, SKUs must be unique and are stored in uppercase. Multiple products can exist without an SKU.
// - **Image Handling**: Supports up to 8 image uploads
// - **Form Data**: Create endpoint uses multipart/form-data for image uploads
// - **JSON Data**: Update endpoint uses application/json

// ### **Search & Filter Options:**
// - **searchTerm**: Searches in name and description fields
// - **categories**: Filter by product categories
// - **skintype**: Filter by skin type
// - **ingredients**: Filter by ingredients
// - **isFeatured**: Filter featured products
// - **sort**: Sort by any field (price, createdAt, name, etc.)
// - **limit/page**: Pagination support

// ### **Common Error Responses:**

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

// ### **Validation Error (400):**
// ```json
// {
//   "statusCode": 400,
//   "success": false,
//   "message": "Invalid skintype. Must be one of: Dry, Oily, Combination, Sensitive, Normal (case-sensitive)"
// }
// ```

// ### **Case-Sensitive Validation Error (400):**
// ```json
// {
//   "statusCode": 400,
//   "success": false,
//   "message": "Invalid ingredient. Must be one of: Hyaluronic Acid, Vitamin C, Retinol, Niacinamide, Peptides (case-sensitive)"
// }
// ```

// ### **Duplicate SKU (400):**
// ```json
// {
//   "statusCode": 400,
//   "success": false,
//   "message": "E11000 duplicate key error collection: products index: sku_1 dup key: { sku: \"VITC-SERUM-001\" }"
// }
// ```