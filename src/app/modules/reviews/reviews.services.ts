import review, { ReviewAuditLog } from "./reviews.model";
import { IReview } from "./reviews.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { Types } from "mongoose";
import { CacheHelper } from "../../helper/cache";
import AppError from "../../errors/AppError";
import status from "http-status";
import OrderModel from "../order/order.model";
import product from "../products/products.model";
import users from "../user/user.model";

/**
 * Multilingual, case-insensitive auto-flagging evaluation engine
 */
const evaluateReviewModeration = (rating: number, comment: string) => {
  const englishKeywords = [
    'scam', 'fake', 'fraud', 'cheating', 'cheater', 'thief', 'stolen', 'broken',
    'damaged', 'defective', 'poor quality', 'low quality', 'terrible', 'worst',
    'useless', 'waste of money', 'bad product', 'very bad', 'disappointed',
    'disappointment', 'misleading', 'not working', "doesn't work", 'faulty',
    'return requested', 'refund requested', 'duplicate product', 'counterfeit',
    'horrible', 'pathetic', 'garbage', 'trash', 'junk', 'unacceptable',
    'dissatisfied', 'unhappy', 'late delivery', 'missing item', 'wrong product',
    'customer service is bad'
  ];

  const banglaKeywords = [
    'প্রতারণা', 'জাল', 'ভুয়া', 'ফেক', 'স্ক্যাম', 'ঠকিয়েছে', 'ঠকানো', 'চিটার',
    'নকল', 'খারাপ', 'খুব খারাপ', 'একদম খারাপ', 'বাজে', 'ভয়ংকর', 'জঘন্য',
    'নষ্ট', 'ড্যামেজ', 'ক্ষতিগ্রস্ত', 'কাজ করে না', 'কাজ করছে না',
    'চালু হয় না', 'চালু হয় না', 'ব্যবহার অযোগ্য', 'টাকার অপচয়', 'টাকার অপচয়',
    'টাকা নষ্ট', 'রিফান্ড চাই', 'রিটার্ন চাই', 'ভুল পণ্য', 'ভুল প্রোডাক্ট',
    'পণ্য পাইনি', 'প্রোডাক্ট পাইনি', 'অসম্পূর্ণ', 'হতাশ', 'খুব হতাশ',
    'সন্তুষ্ট নই', 'অসন্তুষ্ট', 'সার্ভিস খারাপ', 'ডেলিভারি খারাপ', 'দেরিতে ডেলিভারি',
    'একদম পছন্দ হয়নি', 'একদম পছন্দ হয়নি', 'নিম্নমানের', 'নিম্ন মানের', 'ভাঙা',
    'মান খারাপ', 'কোয়ালিটি খারাপ', 'কোয়ালিটি খারাপ'
  ];

  const commentLower = (comment || "").toLowerCase();
  const detectedKeywords: string[] = [];

  // Match English keywords
  englishKeywords.forEach(keyword => {
    if (commentLower.includes(keyword)) {
      detectedKeywords.push(keyword);
    }
  });

  // Match Bangla keywords
  banglaKeywords.forEach(keyword => {
    if (commentLower.includes(keyword)) {
      detectedKeywords.push(keyword);
    }
  });

  let status: 'active' | 'flagged' = 'active';
  let flagReason = '';

  if (rating <= 2) {
    status = 'flagged';
    flagReason = `Low Rating: ${rating} Star(s)`;
  }

  if (detectedKeywords.length > 0) {
    status = 'flagged';
    const keywordReason = `Detected negative keywords: [${detectedKeywords.join(', ')}]`;
    if (flagReason) {
      flagReason = `${flagReason} & ${keywordReason}`;
    } else {
      flagReason = keywordReason;
    }
  }

  return {
    status,
    flagReason: flagReason || undefined,
    detectedKeywords: detectedKeywords.length > 0 ? detectedKeywords : undefined
  };
};

/**
 * Creates a new review in the database or updates an existing one
 * @param payload - Review data including product_id, user_id, order_id, rating, and comment
 * @returns Promise<IReview> - The created or updated review document
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
  const filterObj: any = {};

  // Handle status
  if (query.status && query.status !== 'all') {
    filterObj.status = query.status;
  } else {
    // Explicitly request all statuses so the find hook doesn't exclude deleted ones
    filterObj.status = { $in: ['active', 'flagged', 'deleted'] };
  }

  // Handle rating
  if (query.rating) {
    filterObj.rating = Number(query.rating);
  }

  // Handle product
  if (query.product_id) {
    filterObj.product_id = new Types.ObjectId(query.product_id);
  }

  // Handle customer/user
  if (query.user_id) {
    filterObj.user_id = new Types.ObjectId(query.user_id);
  }

  // Handle date range
  if (query.startDate || query.endDate) {
    filterObj.createdAt = {};
    if (query.startDate) {
      filterObj.createdAt.$gte = new Date(query.startDate);
    }
    if (query.endDate) {
      const end = new Date(query.endDate);
      end.setHours(23, 59, 59, 999);
      filterObj.createdAt.$lte = end;
    }
  }

  // Handle search across populated references
  if (query.search) {
    const searchRegex = new RegExp(query.search, 'i');
    
    // 1. Find matching users
    const matchedUsers = await users.find({
      $or: [
        { fullname: searchRegex },
        { email: searchRegex }
      ]
    }).select('_id');
    const userIds = matchedUsers.map(u => u._id);

    // 2. Find matching products
    const matchedProducts = await product.find({
      name: searchRegex
    }).select('_id');
    const productIds = matchedProducts.map(p => p._id);

    // 3. Construct review search query
    const searchConditions: any[] = [
      { comment: searchRegex }
    ];

    if (userIds.length > 0) {
      searchConditions.push({ user_id: { $in: userIds } });
    }
    if (productIds.length > 0) {
      searchConditions.push({ product_id: { $in: productIds } });
    }

    if (Types.ObjectId.isValid(query.search)) {
      searchConditions.push({ order_id: new Types.ObjectId(query.search) });
    }

    filterObj.$or = searchConditions;
  }

  // Use QueryBuilder with our dynamic filterObj
  const reviewQuery = new QueryBuilder(
    review.find(filterObj).populate("product_id").populate("user_id"),
    query
  )
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
  const result = await review.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  }).populate("product_id").populate("user_id");

  if (result && result.product_id) {
    const rawProductId = result.product_id as any;
    const productId = rawProductId._id ? rawProductId._id.toString() : rawProductId.toString();
    CacheHelper.invalidateTags(["products", `product:${productId}`]);
  } else {
    CacheHelper.invalidateTags(["products"]);
  }
  return result;
};

/**
 * Soft deletes a review by setting isDelete flag to true
 * @param id - Review ID to delete
 * @returns Promise<IReview | null> - Updated review document or null if not found
 */
const deleteReviewFromDb = async (id: string) => {
  const result = await review.findByIdAndUpdate(
    id,
    { isDelete: true, status: 'deleted', deletedAt: new Date() },
    { new: true }
  );

  if (result && result.product_id) {
    const rawProductId = result.product_id as any;
    const productId = rawProductId._id ? rawProductId._id.toString() : rawProductId.toString();
    CacheHelper.invalidateTags(["products", `product:${productId}`]);
  } else {
    CacheHelper.invalidateTags(["products"]);
  }
  return result;
};

/**
 * Updates status of a review with soft-delete metadata support and audit logging
 */
const updateReviewStatusInDb = async (id: string, payload: { status: 'active' | 'flagged' | 'deleted', adminId: string, adminName: string }) => {
  const targetReview = await review.findOne({ _id: new Types.ObjectId(id), status: { $in: ['active', 'flagged', 'deleted'] } });
  if (!targetReview) {
    throw new AppError(status.NOT_FOUND, "Review not found");
  }

  const previousStatus = targetReview.status;
  const updateData: any = { status: payload.status };
  
  if (payload.status === 'deleted') {
    updateData.isDelete = true;
    updateData.deletedAt = new Date();
    updateData.deletedBy = new Types.ObjectId(payload.adminId);
  } else {
    updateData.isDelete = false;
    updateData.deletedAt = null;
    updateData.deletedBy = null;
  }

  const result = await review.findOneAndUpdate(
    { _id: new Types.ObjectId(id), status: { $in: ['active', 'flagged', 'deleted'] } },
    updateData,
    { new: true, runValidators: true }
  ).populate("product_id").populate("user_id");

  if (result) {
    // Create audit log
    await ReviewAuditLog.create({
      adminName: payload.adminName,
      actionType: payload.status === 'deleted' ? 'soft_delete' : payload.status === 'active' ? 'approve' : 'keep_flagged',
      reviewId: result._id,
      previousStatus: previousStatus,
      newStatus: payload.status
    });
  }

  return result;
};

/**
 * Bulk updates statuses of reviews and records audit logs
 */
const bulkUpdateReviewStatusesInDb = async (payload: { ids: string[], status: 'active' | 'flagged' | 'deleted', adminId: string, adminName: string }) => {
  const updateData: any = { status: payload.status };
  
  if (payload.status === 'deleted') {
    updateData.isDelete = true;
    updateData.deletedAt = new Date();
    updateData.deletedBy = new Types.ObjectId(payload.adminId);
  } else {
    updateData.isDelete = false;
    updateData.deletedAt = null;
    updateData.deletedBy = null;
  }

  // Fetch reviews before bulk update to record their previous status
  const targetReviews = await review.find({
    _id: { $in: payload.ids.map(id => new Types.ObjectId(id)) },
    status: { $in: ['active', 'flagged', 'deleted'] }
  });

  const result = await review.updateMany(
    { _id: { $in: payload.ids.map(id => new Types.ObjectId(id)) }, status: { $in: ['active', 'flagged', 'deleted'] } },
    updateData
  );

  // Write audit logs for each updated review
  const actionType = payload.status === 'deleted' ? 'soft_delete' : payload.status === 'active' ? 'approve' : 'keep_flagged';
  
  const auditLogs = targetReviews.map(r => ({
    adminName: payload.adminName,
    actionType,
    reviewId: r._id,
    previousStatus: r.status,
    newStatus: payload.status
  }));

  if (auditLogs.length > 0) {
    await ReviewAuditLog.create(auditLogs);
  }

  return result;
};

/**
 * Calculates review analytics for admin moderation
 */
const getReviewAnalyticsFromDb = async () => {
  const totalReviews = await review.countDocuments({ status: { $in: ['active', 'flagged', 'deleted'] } });
  const activeReviews = await review.countDocuments({ status: 'active' });
  const flaggedReviews = await review.countDocuments({ status: 'flagged' });
  const deletedReviews = await review.countDocuments({ status: 'deleted' });

  // Average rating of non-deleted reviews
  const avgRatingRes = await review.aggregate([
    { $group: { _id: null, averageRating: { $avg: '$rating' } } }
  ]);
  const averageRating = avgRatingRes.length > 0 ? Number(avgRatingRes[0].averageRating.toFixed(1)) : 0;

  // Reviews created in current month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);
  const reviewsThisMonth = await review.countDocuments({
    createdAt: { $gte: startOfMonth },
    status: { $in: ['active', 'flagged'] }
  });

  // Star counts distribution (1 to 5 stars) for non-deleted reviews
  const starDistribution = await review.aggregate([
    { $group: { _id: '$rating', count: { $sum: 1 } } }
  ]);
  
  const starCounts: Record<number, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0
  };

  starDistribution.forEach((item: any) => {
    if (item._id >= 1 && item._id <= 5) {
      starCounts[item._id] = item.count;
    }
  });

  return {
    totalReviews,
    activeReviews,
    flaggedReviews,
    deletedReviews,
    averageRating,
    reviewsThisMonth,
    starCounts
  };
};

/**
 * Permanently deletes a review from database (Super Admin only) and logs action
 */
const permanentDeleteReviewFromDb = async (id: string, payload: { adminName: string }) => {
  const targetReview = await review.findOne({ _id: new Types.ObjectId(id), status: { $in: ['active', 'flagged', 'deleted'] } });
  if (!targetReview) {
    throw new AppError(status.NOT_FOUND, "Review not found");
  }

  const result = await review.findByIdAndDelete(id);

  // Write audit log
  await ReviewAuditLog.create({
    adminName: payload.adminName,
    actionType: 'permanent_delete',
    reviewId: new Types.ObjectId(id),
    previousStatus: targetReview.status,
    newStatus: 'permanently_deleted'
  });

  return result;
};

/**
 * Retrieves audit logs for review moderation
 */
const getReviewAuditLogsFromDb = async (query: any) => {
  const auditLogsQuery = new QueryBuilder(
    ReviewAuditLog.find().populate({
      path: 'reviewId',
      populate: [
        { path: 'product_id' },
        { path: 'user_id' }
      ]
    }),
    query
  )
    .sort()
    .paginate()
    .fields();

  const result = await auditLogsQuery.modelQuery;
  const meta = await auditLogsQuery.countTotal();

  return {
    result,
    meta
  };
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
  updateReviewStatusInDb,
  bulkUpdateReviewStatusesInDb,
  getReviewAnalyticsFromDb,
  permanentDeleteReviewFromDb,
  getReviewAuditLogsFromDb,
};

export default ReviewServices;