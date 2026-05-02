import cart from "./cart.model";
import { ICart } from "./cart.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import product from "../products/products.model";

/**
 * Adds a product to user's cart or updates quantity if already exists
 * @param payload - Cart data including user_id, product_id, quantity
 * @returns Promise<ICart> - The created or updated cart item
 */
const addToCartIntoDb = async (payload: ICart) => {
  // Check if product exists and get current price
  const productData = await product.findById(payload.product_id);
  if (!productData) {
    throw new Error("Product not found");
  }

  // Check if product is in stock
  if ((productData.stock_quantity ?? 0) < payload.quantity) {
    throw new Error("Insufficient stock");
  }

  // Check if item already exists in cart
  const existingCartItem = await cart.findOne({
    user_id: payload.user_id,
    product_id: payload.product_id
  });

  if (existingCartItem) {
    // Update quantity if item exists
    const newQuantity = existingCartItem.quantity + payload.quantity;

    // Check stock again for new quantity
    if ((productData.stock_quantity ?? 0) < newQuantity) {
      throw new Error("Insufficient stock for requested quantity");
    }

    const result = await cart.findByIdAndUpdate(
      existingCartItem._id,
      {
        quantity: newQuantity,
        price_at_addition: productData.price // Update price to current price
      },
      { new: true, runValidators: true }
    ).populate("product_id");

    return result;
  } else {
    // Create new cart item with current product price
    const cartItem = {
      ...payload,
      price_at_addition: productData.price
    };

    const result = await cart.create(cartItem);
    return await cart.findById(result._id).populate("product_id");
  }
};

/**
 * Retrieves all cart items for a user with pagination
 * @param userId - User ID to filter cart items by
 * @param query - Query parameters for search, sort, pagination
 * @returns Promise<{result: ICart[], meta: object}> - User's cart items and metadata
 */
const getCartByUser = async (userId: string, query: any) => {
  const cartQuery = new QueryBuilder(
    cart.find({ user_id: userId }).populate("product_id"),
    query
  )
    .search(["product_id.name"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await cartQuery.modelQuery;
  const meta = await cartQuery.countTotal();

  // Calculate cart totals
  const subtotal = result.reduce((total: number, item: any) => {
    return total + (item.price_at_addition * item.quantity);
  }, 0);

  const totalItems = result.reduce((total: number, item: any) => {
    return total + item.quantity;
  }, 0);

  return {
    result,
    meta,
    summary: {
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalItems,
      itemCount: result.length
    }
  };
};

/**
 * Updates cart item quantity by product ID
 * @param productId - Product ID to update
 * @param userId - User ID for authorization
 * @param quantity - New quantity
 * @returns Promise<ICart | null> - Updated cart item or null if not found
 */
const updateCartItemQuantity = async (productId: string, userId: string, quantity: number) => {
  // If quantity is 0 or negative, remove the item instead
  if (quantity <= 0) {
    return await removeFromCartByUserAndProduct(userId, productId);
  }

  // Find cart item and verify ownership
  const cartItem = await cart.findOne({
    user_id: userId,
    product_id: productId
  }).populate("product_id");

  if (!cartItem) {
    throw new Error("Cart item not found or unauthorized");
  }

  // Check product stock
  const productData = cartItem.product_id as any;
  if ((productData.stock_quantity ?? 0) < quantity) {
    throw new Error("Insufficient stock");
  }

  // Update quantity
  const result = await cart.findOneAndUpdate(
    { user_id: userId, product_id: productId },
    { quantity },
    { new: true, runValidators: true }
  ).populate("product_id");

  return result;
};

/**
 * Removes a product from user's cart
 * @param userId - User ID
 * @param productId - Product ID to remove
 * @returns Promise<ICart | null> - Removed cart item or null if not found
 */
const removeFromCartByUserAndProduct = async (userId: string, productId: string) => {
  const result = await cart.findOneAndDelete({
    user_id: userId,
    product_id: productId
  });

  return result;
};

/**
 * Hard deletes a cart item by ID
 * @param id - Cart item ID to delete
 * @param userId - User ID for authorization
 * @returns Promise<ICart | null> - Deleted cart item or null if not found
 */
const deleteCartItemFromDb = async (id: string, userId: string) => {
  // Verify ownership before deletion
  const cartItem = await cart.findOne({
    _id: id,
    user_id: userId
  });

  if (!cartItem) {
    throw new Error("Cart item not found or unauthorized");
  }

  const result = await cart.findByIdAndDelete(id);

  return result;
};

/**
 * Clears all items from user's cart
 * @param userId - User ID
 * @returns Promise<number> - Number of items cleared
 */
const clearUserCart = async (userId: string) => {
  const result = await cart.deleteMany({
    user_id: userId
  });

  return result.deletedCount;
};

/**
 * Gets cart summary for a user
 * @param userId - User ID
 * @returns Promise<object> - Cart summary with totals
 */
const getCartSummaryByUser = async (userId: string) => {
  const cartItems = await cart.find({
    user_id: userId
  }).populate("product_id");

  const subtotal = cartItems.reduce((total: number, item: any) => {
    return total + (item.price_at_addition * item.quantity);
  }, 0);

  const totalItems = cartItems.reduce((total: number, item: any) => {
    return total + item.quantity;
  }, 0);

  return {
    subtotal: parseFloat(subtotal.toFixed(2)),
    totalItems,
    itemCount: cartItems.length,
    items: cartItems.map((item: any) => ({
      id: item._id,
      product_id: item.product_id._id,
      product_name: item.product_id.name,
      quantity: item.quantity,
      price: item.price_at_addition,
      subtotal: parseFloat((item.price_at_addition * item.quantity).toFixed(2))
    }))
  };
};

/**
 * Check if product is in user's cart
 * @param userId - User ID
 * @param productId - Product ID to check
 * @returns Promise<ICart | null> - Cart item if found, null otherwise
 */
const checkIfProductInCart = async (userId: string, productId: string) => {
  const result = await cart.findOne({
    user_id: userId,
    product_id: productId
  }).populate("product_id");

  return result;
};

const CartServices = {
  addToCartIntoDb,
  getCartByUser,
  updateCartItemQuantity,
  removeFromCartByUserAndProduct,
  deleteCartItemFromDb,
  clearUserCart,
  getCartSummaryByUser,
  checkIfProductInCart,
};

export default CartServices;
