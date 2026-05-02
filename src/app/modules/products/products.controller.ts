import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import ProductServices from "./products.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

/**
 * Controller: Create a new product
 * Only accessible by admin and superAdmin users
 * Handles HTTP POST requests to /product
 */
const createProduct: RequestHandler = catchAsync(async (req, res) => {
  // Pass payload directly to service - Cloudinary upload is handled in service layer
  const payload = req.body;

  // Call service layer to create product in database
  const result = await ProductServices.createProductIntoDb(payload);

  // Send standardized success response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Product created successfully",
    data: result,
  });
});

/**
 * Controller: Get all products with filtering, search, and pagination
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /product
 */
const getAllProducts: RequestHandler = catchAsync(async (req, res) => {
  // Extract query parameters for filtering, search, pagination
  const result = await ProductServices.getAllProductsFromDb(req.query);

  // Send response with products and pagination metadata
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Products retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

/**
 * Controller: Get a single product by ID
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /product/:id
 */
const getSingleProduct: RequestHandler = catchAsync(async (req, res) => {
  // Extract product ID from URL parameters and query params for reviews pagination
  const result = await ProductServices.getSingleProductFromDb(
    req.params.id,
    req.query
  );

  // Send response with single product data
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product retrieved successfully",
    data: result,
  });
});

/**
 * Controller: Update a product by ID
 * Only accessible by admin and superAdmin users
 * Handles HTTP PUT requests to /product/:id
 */
const updateProduct: RequestHandler = catchAsync(async (req, res) => {
  // Extract product ID from URL parameters and update data from request body
  const result = await ProductServices.updateProductIntoDb(
    req.params.id,
    req.body
  );

  // Send response with updated product data
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product updated successfully",
    data: result,
  });
});

/**
 * Controller: Delete a product by ID
 * Only accessible by admin and superAdmin users
 * Handles HTTP DELETE requests to /product/:id
 */
const deleteProduct: RequestHandler = catchAsync(async (req, res) => {
  // Extract product ID from URL parameters for deletion
  const result = await ProductServices.deleteProductFromDb(req.params.id);

  // Send response confirming deletion
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product deleted successfully",
    data: result,
  });
});

/**
 * Controller: Get products that belong to a specific collection
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /product/collection/:collectionId
 */
const getProductsByCollection: RequestHandler = catchAsync(async (req, res) => {
  // Extract collection ID from URL parameters
  const { collectionId } = req.params;

  // Call service to filter products by collection
  const result = await ProductServices.getProductsByCollection(
    collectionId,
    req.query
  );

  // Send response with filtered products and pagination metadata
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Products retrieved successfully by collection",
    meta: result.meta,
    data: result.result,
  });
});

/**
 * Controller: Get related products based on categories, skin type, or ingredients
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /product/getrelatedproducts/:id
 */
const getRelatedProducts: RequestHandler = catchAsync(async (req, res) => {
  // Extract product ID from URL parameters
  const { id } = req.params;

  // Call service to get related products
  const result = await ProductServices.getRelatedProducts(id, req.query);

  // Send response with related products and pagination metadata
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Related products retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

/**
 * Controller: Get featured products
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /product/getfeaturedproducts
 */
const getFeaturedProducts: RequestHandler = catchAsync(async (req, res) => {
  // Call service to get featured products
  const result = await ProductServices.getFeaturedProducts(req.query);

  // Send response with featured products and pagination metadata
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Featured products retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

/**
 * Controller: Search products by name with minimal data
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /product/search?q=searchTerm
 */
const searchProducts: RequestHandler = catchAsync(async (req, res) => {
  const searchTerm = req.query.q as string;
  
  // Call service to search products
  const products = await ProductServices.searchProducts(searchTerm);

  // Send response with minimal product data
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: products.length > 0 
      ? 'Products found successfully' 
      : 'No products found matching your search',
    data: products,
  });
});

const ProductControllers = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  getProductsByCollection,
  getRelatedProducts,
  getFeaturedProducts,
  searchProducts,
};

export default ProductControllers;
