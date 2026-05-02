import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import CartServices from "./cart.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

/**
 * Controller: Add a product to user's cart
 * Accessible by authenticated users
 * Handles HTTP POST requests to /cart
 */
const addToCart: RequestHandler = catchAsync(async (req, res) => {
  // Validate request body exists
  if (!req.body) {
    return sendResponse(res, {
      statusCode: status.BAD_REQUEST,
      success: false,
      message: "Request body is required",
      data: null,
    });
  }

  // Create payload with user_id from authenticated user
  const payload = {
    ...req.body,
    user_id: req.user?.id,
  };
  
  // Call service layer to add item to cart
  const result = await CartServices.addToCartIntoDb(payload);
  
  // Send standardized success response
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Product added to cart successfully",
    data: result,
  });
});

/**
 * Controller: Get current user's cart with summary
 * Accessible by authenticated users
 * Handles HTTP GET requests to /cart
 */
const getMyCart: RequestHandler = catchAsync(async (req, res) => {
  // Get user ID from authenticated user
  const userId = req.user?.id;
  
  // Call service to get user's cart
  const result = await CartServices.getCartByUser(userId, req.query);
  
  // Send response with user's cart and summary
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Cart retrieved successfully",
    meta: result.meta,
    data: {
      items: result.result,
      summary: result.summary
    },
  });
});

/**
 * Controller: Update cart item quantity
 * Accessible by authenticated users
 * Handles HTTP PUT requests to /cart/product/:productId
 */
const updateCartItemQuantity: RequestHandler = catchAsync(async (req, res) => {
  // Get user ID from authenticated user and product ID from URL parameters
  const userId = req.user?.id;
  const { productId } = req.params;
  const { quantity } = req.body;
  
  // Call service to update cart item quantity
  const result = await CartServices.updateCartItemQuantity(productId, userId, quantity);
  
  // Send response confirming update
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Cart item quantity updated successfully",
    data: result,
  });
});

/**
 * Controller: Remove a product from user's cart
 * Accessible by authenticated users
 * Handles HTTP DELETE requests to /cart/product/:productId
 */
const removeFromCart: RequestHandler = catchAsync(async (req, res) => {
  // Get user ID from authenticated user and product ID from URL parameters
  const userId = req.user?.id;
  const { productId } = req.params;
  
  // Call service to remove product from cart
  const result = await CartServices.removeFromCartByUserAndProduct(userId, productId);
  
  // Send response confirming removal
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Product removed from cart successfully",
    data: result,
  });
});

/**
 * Controller: Delete a cart item by ID
 * Accessible by authenticated users
 * Handles HTTP DELETE requests to /cart/:id
 */
const deleteCartItem: RequestHandler = catchAsync(async (req, res) => {
  // Get user ID from authenticated user and cart item ID from URL parameters
  const userId = req.user?.id;
  const { id } = req.params;
  
  // Call service to delete cart item
  const result = await CartServices.deleteCartItemFromDb(id, userId);
  
  // Send response confirming deletion
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Cart item deleted successfully",
    data: result,
  });
});

/**
 * Controller: Clear all items from user's cart
 * Accessible by authenticated users
 * Handles HTTP DELETE requests to /cart/clear
 */
const clearMyCart: RequestHandler = catchAsync(async (req, res) => {
  // Get user ID from authenticated user
  const userId = req.user?.id;
  
  // Call service to clear user's cart
  const deletedCount = await CartServices.clearUserCart(userId);
  
  // Send response confirming cart cleared
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Cart cleared successfully",
    data: { 
      deletedCount,
      message: `${deletedCount} items removed from cart`
    },
  });
});

/**
 * Controller: Get cart summary for user
 * Accessible by authenticated users
 * Handles HTTP GET requests to /cart/summary
 */
const getCartSummary: RequestHandler = catchAsync(async (req, res) => {
  // Get user ID from authenticated user
  const userId = req.user?.id;
  
  // Call service to get cart summary
  const result = await CartServices.getCartSummaryByUser(userId);
  
  // Send response with cart summary
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Cart summary retrieved successfully",
    data: result,
  });
});

/**
 * Controller: Check if a product is in user's cart
 * Accessible by authenticated users
 * Handles HTTP GET requests to /cart/check/:productId
 */
const checkIfProductInCart: RequestHandler = catchAsync(async (req, res) => {
  // Get user ID from authenticated user and product ID from URL parameters
  const userId = req.user?.id;
  const { productId } = req.params;
  
  // Call service to check if product is in cart
  const result = await CartServices.checkIfProductInCart(userId, productId);
  
  // Send response indicating if product is in cart
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: result ? "Product found in cart" : "Product not in cart",
    data: { 
      isInCart: !!result, 
      cartItem: result 
    },
  });
});

const CartControllers = {
  addToCart,
  getMyCart,
  updateCartItemQuantity,
  removeFromCart,
  deleteCartItem,
  clearMyCart,
  getCartSummary,
  checkIfProductInCart,
};

export default CartControllers;
