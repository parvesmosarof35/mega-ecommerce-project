import review from "./reviews.model";
import { IReview } from "./reviews.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { Types } from "mongoose";

/**
 * Creates a new review in the database
 * @param payload - Review data including product_id, user_id, rating, and comment
 * @returns Promise<IReview> - The created review document
 */
const createReviewIntoDb = async (payload: IReview) => {
  const result = await review.create(payload);
  return result;
};

/**
 * Retrieves all reviews with advanced filtering, searching, and pagination
 * @param query - Query parameters for search, filter, sort, pagination
 * @returns Promise<{result: IReview[], meta: object}> - Reviews array and metadata
 */
const getAllReviewsFromDb = async (query: any) => {
  // Use QueryBuilder for advanced query operations
  // - Search in comment field
  // - Apply filters, sorting, pagination
  // - Populate product and user details for better response
  const reviewQuery = new QueryBuilder(
    review.find().populate("product_id").populate("user_id"),
    query
  )
    .search(["comment"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();

  return {
    result,
    meta,
  };
};

/**
 * Retrieves a single review by ID with populated product and user details
 * @param id - Review ID
 * @returns Promise<IReview | null> - Single review document or null if not found
 */
const getSingleReviewFromDb = async (id: string) => {
  // Find review by ID and populate product and user details
  const result = await review.findById(id).populate("product_id").populate("user_id");
  return result;
};

/**
 * Retrieves reviews for a specific product
 * @param productId - Product ID to filter reviews by
 * @param query - Additional query parameters for sort, pagination
 * @returns Promise<{result: IReview[], meta: object}> - Filtered reviews array and metadata
 */
const getReviewsByProduct = async (productId: string, query: any) => {
  // Find reviews where product_id matches the specified productId
  // This enables filtering reviews by product for product pages
  const reviewQuery = new QueryBuilder(
    review.find({ product_id: productId }).populate("user_id"),
    query
  )
    .search(["comment"])
    .sort()
    .paginate()
    .fields();

  const result = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();

  return {
    result,
    meta,
  };
};

/**
 * Retrieves reviews by a specific user
 * @param userId - User ID to filter reviews by
 * @param query - Additional query parameters for sort, pagination
 * @returns Promise<{result: IReview[], meta: object}> - Filtered reviews array and metadata
 */
const getReviewsByUser = async (userId: string, query: any) => {
  // Find reviews where user_id matches the specified userId
  // This enables users to see their own review history
  const reviewQuery = new QueryBuilder(
    review.find({ user_id: userId }).populate("product_id"),
    query
  )
    .search(["comment"])
    .sort()
    .paginate()
    .fields();

  const result = await reviewQuery.modelQuery;
  const meta = await reviewQuery.countTotal();

  return {
    result,
    meta,
  };
};

/**
 * Updates a review by ID with validation
 * @param id - Review ID to update
 * @param payload - Partial review data to update
 * @returns Promise<IReview | null> - Updated review document or null if not found
 */
const updateReviewIntoDb = async (id: string, payload: Partial<IReview>) => {
  // Find and update review with:
  // - new: true returns the updated document
  // - runValidators: true ensures schema validation on update
  // - populate product and user to show updated details
  const result = await review.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("product_id").populate("user_id");
  return result;
};

/**
 * Soft deletes a review by setting isDelete flag to true
 * @param id - Review ID to delete
 * @returns Promise<IReview | null> - Updated review document or null if not found
 */
const deleteReviewFromDb = async (id: string) => {
  // Soft delete by setting isDelete flag instead of removing document
  // This preserves data integrity and allows for recovery
  const result = await review.findByIdAndUpdate(
    id,
    { isDelete: true },
    { new: true }
  );
  return result;
};

/**
 * Calculates average rating and total review count for a product
 * @param productId - Product ID to calculate average rating for
 * @returns Promise<{averageRating: number, totalReviews: number}> - Average rating and total reviews (0 if no reviews found)
 */
const getAverageRatingForProduct = async (productId: string) => {
  // Convert string ID to ObjectId for proper matching
  const productObjectId = new Types.ObjectId(productId);
  
  // Calculate average rating and total reviews for all reviews of a specific product
  const result = await review.aggregate([
    { $match: { product_id: productObjectId, isDelete: { $ne: true } } },
    { $group: { _id: "$product_id", averageRating: { $avg: "$rating" }, totalReviews: { $sum: 1 } } }
  ]);

  return result.length > 0 
    ? { averageRating: result[0].averageRating, totalReviews: result[0].totalReviews }
    : { averageRating: 0, totalReviews: 0 };
};

const ReviewServices = {
  createReviewIntoDb,
  getAllReviewsFromDb,
  getSingleReviewFromDb,
  getReviewsByProduct,
  getReviewsByUser,
  updateReviewIntoDb,
  deleteReviewFromDb,
  getAverageRatingForProduct,
};

export default ReviewServices;
