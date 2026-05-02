import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import CollectionServices from "./collection.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

/**
 * Controller: Create a new collection
 * Only accessible by admin and superAdmin users
 * Handles HTTP POST requests to /collection
 */
const createCollection: RequestHandler = catchAsync(async (req, res) => {
  // Call service layer to create collection in database with file upload
  const result = await CollectionServices.createCollectionIntoDb(req as any);
  
  // Send standardized success response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Collection created successfully",
    data: result,
  });
});

/**
 * Controller: Get all collections with filtering, search, and pagination
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /collection
 */
const getAllCollections: RequestHandler = catchAsync(async (req, res) => {
  // Extract query parameters for filtering, search, pagination
  const result = await CollectionServices.getAllCollectionsFromDb(req.query);
  
  // Send response with collections and pagination metadata
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Collections retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

/**
 * Controller: Get a single collection by ID
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /collection/:id
 */
const getSingleCollection: RequestHandler = catchAsync(async (req, res) => {
  // Extract collection ID from URL parameters
  const result = await CollectionServices.getSingleCollectionFromDb(req.params.id);
  
  // Send response with single collection data
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Collection retrieved successfully",
    data: result,
  });
});

/**
 * Controller: Update a collection by ID
 * Only accessible by admin and superAdmin users
 * Handles HTTP PUT requests to /collection/:id
 */
const updateCollection: RequestHandler = catchAsync(async (req, res) => {
  // Call service layer to update collection in database with file upload
  const result = await CollectionServices.updateCollectionIntoDb(req as any, req.params.id);
  
  // Send response with updated collection data
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Collection updated successfully",
    data: result,
  });
});

/**
 * Controller: Soft delete a collection by ID
 * Only accessible by admin and superAdmin users
 * Handles HTTP DELETE requests to /collection/:id
 */
const deleteCollection: RequestHandler = catchAsync(async (req, res) => {
  // Extract collection ID from URL parameters for soft deletion
  const result = await CollectionServices.deleteCollectionFromDb(req.params.id);
  
  // Send response confirming deletion
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Collection deleted successfully",
    data: result,
  });
});

/**
 * Controller: Add products to a collection
 * Only accessible by admin and superAdmin users
 * Handles HTTP POST requests to /collection/:collectionId/products
 * Expects: { productIds: string[] } in request body
 */
const addProductsToCollection: RequestHandler = catchAsync(async (req, res) => {
  // Extract collection ID from URL parameters and product IDs from request body
  const { collectionId } = req.params;
  const { productIds } = req.body;
  
  // Call service to add products to collection (many-to-many relationship)
  const result = await CollectionServices.addProductsToCollection(collectionId, productIds);
  
  // Send response with updated collection including new products
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Products added to collection successfully",
    data: result,
  });
});

/**
 * Controller: Remove products from a collection
 * Only accessible by admin and superAdmin users
 * Handles HTTP DELETE requests to /collection/:collectionId/products
 * Expects: { productIds: string[] } in request body
 */
const removeProductsFromCollection: RequestHandler = catchAsync(async (req, res) => {
  // Extract collection ID from URL parameters and product IDs from request body
  const { collectionId } = req.params;
  const { productIds } = req.body;
  
  // Call service to remove products from collection
  const result = await CollectionServices.removeProductsFromCollection(collectionId, productIds);
  
  // Send response with updated collection excluding removed products
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Products removed from collection successfully",
    data: result,
  });
});

const CollectionControllers = {
  createCollection,
  getAllCollections,
  getSingleCollection,
  updateCollection,
  deleteCollection,
  addProductsToCollection,
  removeProductsFromCollection,
};

export default CollectionControllers;
