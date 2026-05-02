import wishlist from "./wishlists.model";
import { IWishlist } from "./wishlists.interface";
import QueryBuilder from "../../builder/QueryBuilder";

/**
 * Adds a product to user's wishlist
 * @param payload - Wishlist data including user_id and product_id
 * @returns Promise<IWishlist> - The created wishlist item document
 */
const addToWishlistIntoDb = async (payload: IWishlist) => {
  const result = await wishlist.create(payload);
  return result;
};

/**
 * Retrieves all wishlist items with advanced filtering and pagination
 * @param query - Query parameters for search, filter, sort, pagination
 * @returns Promise<{result: IWishlist[], meta: object}> - Wishlist items array and metadata
 */
const getAllWishlistItemsFromDb = async (query: any) => {
  // Use QueryBuilder for advanced query operations
  // - Apply filters, sorting, pagination
  // - Populate product and user details for better response
  const wishlistQuery = new QueryBuilder(
    wishlist.find().populate("product_id").populate("user_id"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await wishlistQuery.modelQuery;
  const meta = await wishlistQuery.countTotal();

  return {
    result,
    meta,
  };
};

/**
 * Retrieves a single wishlist item by ID with populated product and user details
 * @param id - Wishlist item ID
 * @returns Promise<IWishlist | null> - Single wishlist item document or null if not found
 */
const getSingleWishlistItemFromDb = async (id: string) => {
  // Find wishlist item by ID and populate product and user details
  const result = await wishlist.findById(id).populate("product_id").populate("user_id");
  return result;
};

/**
 * Retrieves all wishlist items for a specific user
 * @param userId - User ID to filter wishlist items by
 * @param query - Additional query parameters for sort, pagination
 * @returns Promise<{result: IWishlist[], meta: object}> - Filtered wishlist items array and metadata
 */
const getWishlistByUser = async (userId: string, query: any) => {
  // Find wishlist items where user_id matches specified userId
  // This enables users to see their own wishlist
  const wishlistQuery = new QueryBuilder(
    wishlist.find({ user_id: userId }).populate("product_id"),
    query
  )
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await wishlistQuery.modelQuery;
  const meta = await wishlistQuery.countTotal();

  return {
    result,
    meta,
  };
};

/**
 * Checks if a product is already in user's wishlist
 * @param userId - User ID
 * @param productId - Product ID
 * @returns Promise<IWishlist | null> - Wishlist item if found, null if not found
 */
const checkIfProductInWishlist = async (userId: string, productId: string) => {
  // Check if product already exists in user's wishlist
  // This prevents duplicate wishlist entries
  const result = await wishlist.findOne({ user_id: userId, product_id: productId });
  return result;
};

/**
 * Removes a product from user's wishlist
 * @param userId - User ID
 * @param productId - Product ID to remove
 * @returns Promise<IWishlist | null> - Removed wishlist item or null if not found
 */
const removeFromWishlistByUserAndProduct = async (userId: string, productId: string) => {
  // Remove specific product from user's wishlist
  const result = await wishlist.findOneAndDelete({ user_id: userId, product_id: productId });
  return result;
};

/**
 * Soft deletes a wishlist item by ID
 * @param id - Wishlist item ID to delete
 * @returns Promise<IWishlist | null> - Updated wishlist item document or null if not found
 */
const deleteWishlistItemFromDb = async (id: string) => {
  // Soft delete by setting isDelete flag instead of removing document
  // This preserves data integrity and allows for recovery
  const result = await wishlist.findByIdAndUpdate(
    id,
    { isDelete: true },
    { new: true }
  );
  return result;
};

/**
 * Removes all wishlist items for a specific user
 * @param userId - User ID to clear wishlist for
 * @returns Promise<number> - Number of items removed
 */
const clearUserWishlist = async (userId: string) => {
  // Soft delete all items in user's wishlist
  const result = await wishlist.updateMany(
    { user_id: userId },
    { isDelete: true }
  );
  return result.modifiedCount;
};

/**
 * Gets count of items in user's wishlist
 * @param userId - User ID
 * @returns Promise<number> - Number of items in wishlist
 */
const getWishlistCountByUser = async (userId: string) => {
  // Count active (non-deleted) items in user's wishlist
  const result = await wishlist.countDocuments({ user_id: userId, isDelete: { $ne: true } });
  return result;
};

const WishlistServices = {
  addToWishlistIntoDb,
  getAllWishlistItemsFromDb,
  getSingleWishlistItemFromDb,
  getWishlistByUser,
  checkIfProductInWishlist,
  removeFromWishlistByUserAndProduct,
  deleteWishlistItemFromDb,
  clearUserWishlist,
  getWishlistCountByUser,
};

export default WishlistServices;
