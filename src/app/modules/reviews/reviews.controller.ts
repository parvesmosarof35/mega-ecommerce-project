import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import ReviewServices from "./reviews.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

/**
 * Controller: Create a new review
 * Accessible by authenticated users (buyers, sellers, admin, superAdmin)
 * Handles HTTP POST requests to /review
 */
const createReview: RequestHandler = catchAsync(async (req, res) => {
  // Add user_id from authenticated user to request body
  req.body.user_id = req.user?.id;
  
  // Call service layer to create review in database
  const result = await ReviewServices.createReviewIntoDb(req.body);
  
  // Send standardized success response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

/**
 * Controller: Get all reviews with filtering, search, and pagination
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /review
 */
const getAllReviews: RequestHandler = catchAsync(async (req, res) => {
  // Extract query parameters for filtering, search, pagination
  const result = await ReviewServices.getAllReviewsFromDb(req.query);
  
  // Send response with reviews and pagination metadata
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Reviews retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

/**
 * Controller: Get a single review by ID
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /review/:id
 */
const getSingleReview: RequestHandler = catchAsync(async (req, res) => {
  // Extract review ID from URL parameters
  const result = await ReviewServices.getSingleReviewFromDb(req.params.id);
  
  // Send response with single review data
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Review retrieved successfully",
    data: result,
  });
});

/**
 * Controller: Get reviews for a specific product
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /review/product/:productId
 */
const getReviewsByProduct: RequestHandler = catchAsync(async (req, res) => {
  // Extract product ID from URL parameters
  const { productId } = req.params;
  
  // Call service to filter reviews by product
  const result = await ReviewServices.getReviewsByProduct(productId, req.query);
  
  // Send response with filtered reviews and pagination metadata
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product reviews retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

/**
 * Controller: Get reviews by a specific user
 * Accessible by the user themselves or admin/superAdmin
 * Handles HTTP GET requests to /review/user/:userId
 */
const getReviewsByUser: RequestHandler = catchAsync(async (req, res) => {
  // Extract user ID from URL parameters
  const { userId } = req.params;
  
  // Call service to filter reviews by user
  const result = await ReviewServices.getReviewsByUser(userId, req.query);
  
  // Send response with filtered reviews and pagination metadata
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "User reviews retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

/**
 * Controller: Update a review by ID
 * Accessible by the review owner or admin/superAdmin
 * Handles HTTP PUT requests to /review/:id
 */
const updateReview: RequestHandler = catchAsync(async (req, res) => {
  // Extract review ID from URL parameters and update data from request body
  const result = await ReviewServices.updateReviewIntoDb(req.params.id, req.body);
  
  // Send response with updated review data
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Review updated successfully",
    data: result,
  });
});

/**
 * Controller: Soft delete a review by ID
 * Accessible by the review owner or admin/superAdmin
 * Handles HTTP DELETE requests to /review/:id
 */
const deleteReview: RequestHandler = catchAsync(async (req, res) => {
  // Extract review ID from URL parameters for soft deletion
  const result = await ReviewServices.deleteReviewFromDb(req.params.id);
  
  // Send response confirming deletion
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

/**
 * Controller: Get average rating for a product
 * Publicly accessible endpoint
 * Handles HTTP GET requests to /review/average-rating/:productId
 */
const getAverageRatingForProduct: RequestHandler = catchAsync(async (req, res) => {
  // Extract product ID from URL parameters
  const { productId } = req.params;
  
  // Call service to calculate average rating
  const result = await ReviewServices.getAverageRatingForProduct(productId);
  
  // Send response with average rating
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Average rating retrieved successfully",
    data: { averageRating: result },
  });
});

const ReviewControllers = {
  createReview,
  getAllReviews,
  getSingleReview,
  getReviewsByProduct,
  getReviewsByUser,
  updateReview,
  deleteReview,
  getAverageRatingForProduct,
};

export default ReviewControllers;
