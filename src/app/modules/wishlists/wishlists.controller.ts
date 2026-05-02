import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import WishlistServices from "./wishlists.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

/**
 * Controller: Add a product to user's wishlist
 * Accessible by authenticated users (buyers, sellers, admin, superAdmin)
 * Handles HTTP POST requests to /wishlist
 */
const addToWishlist: RequestHandler = catchAsync(async (req, res) => {
  // Add user_id from authenticated user to request body
  req.body.user_id = req.user?.id;
  
  // Call service layer to add item to wishlist
  const result = await WishlistServices.addToWishlistIntoDb(req.body);
  
  // Send standardized success response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Product added to wishlist successfully",
    data: result,
  });
});

/**
 * Controller: Get current user's wishlist
 * Accessible by authenticated users
 * Handles HTTP GET requests to /wishlist/my-wishlist
 */
const getMyWishlist: RequestHandler = catchAsync(async (req, res) => {
  // Get user ID from authenticated user
  const userId = req.user?.id;
  
  // Call service to get current user's wishlist
  const result = await WishlistServices.getWishlistByUser(userId, req.query);
  
  // Send response with user's wishlist and pagination metadata
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Your wishlist retrieved successfully",
    meta: result.meta,
    data: result.result,
  });
});

/**
 * Controller: Check if a product is in user's wishlist
 * Accessible by authenticated users
 * Handles HTTP GET requests to /wishlist/check/:productId
 */
const checkIfProductInWishlist: RequestHandler = catchAsync(async (req, res) => {
  // Get user ID from authenticated user and product ID from URL parameters
  const userId = req.user?.id;
  const { productId } = req.params;
  
  // Call service to check if product is in wishlist
  const result = await WishlistServices.checkIfProductInWishlist(userId, productId);
  
  // Send response indicating if product is in wishlist
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Wishlist check completed successfully",
    data: { isInWishlist: !!result, wishlistItem: result },
  });
});

/**
 * Controller: Remove a product from user's wishlist
 * Accessible by authenticated users
 * Handles HTTP DELETE requests to /wishlist/product/:productId
 */
const removeFromWishlist: RequestHandler = catchAsync(async (req, res) => {
  // Get user ID from authenticated user and product ID from URL parameters
  const userId = req.user?.id;
  const { productId } = req.params;
  
  // Call service to remove product from wishlist
  const result = await WishlistServices.removeFromWishlistByUserAndProduct(userId, productId);
  
  // Send response confirming removal
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product removed from wishlist successfully",
    data: result,
  });
});

/**
 * Controller: Clear all items from user's wishlist
 * Accessible by authenticated users
 * Handles HTTP DELETE requests to /wishlist/clear
 */
const clearMyWishlist: RequestHandler = catchAsync(async (req, res) => {
  // Get user ID from authenticated user
  const userId = req.user?.id;
  
  // Call service to clear user's wishlist
  const result = await WishlistServices.clearUserWishlist(userId);
  
  // Send response confirming wishlist cleared
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Wishlist cleared successfully",
    data: { deletedCount: result },
  });
});

/**
 * Controller: Get count of items in user's wishlist
 * Accessible by authenticated users
 * Handles HTTP GET requests to /wishlist/count
 */
const getMyWishlistCount: RequestHandler = catchAsync(async (req, res) => {
  // Get user ID from authenticated user
  const userId = req.user?.id;
  
  // Call service to get wishlist count
  const result = await WishlistServices.getWishlistCountByUser(userId);
  
  // Send response with wishlist count
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Wishlist count retrieved successfully",
    data: { count: result },
  });
});

const WishlistControllers = {
  addToWishlist,
  getMyWishlist,
  checkIfProductInWishlist,
  removeFromWishlist,
  clearMyWishlist,
  getMyWishlistCount,
};

export default WishlistControllers;
