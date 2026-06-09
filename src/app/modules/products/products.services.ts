import product from "./products.model";
import { IProduct } from "./products.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import ReviewServices from "../reviews/reviews.services";
import { deleteFromCloudinary } from "../../utils/cloudinary";
import { CacheHelper } from "../../helper/cache";

/**
 * Creates a new product in the database
 * @param payload - Product data including name, description, price, stock, and images_urls
 * @returns Promise<IProduct> - The created product document
 */
const createProductIntoDb = async (payload: any) => {
  try {
    const result = await product.create(payload);
    CacheHelper.invalidateTags(["products"]);
    return result;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Retrieves all products with advanced filtering, searching, and pagination
 * @param query - Query parameters for search, filter, sort, pagination
 * @returns Promise<{result: IProduct[], meta: object}> - Products array with rating data and metadata
 */
const getAllProductsFromDb = async (query: any) => {
  const cacheKey = CacheHelper.generateKey("products:list", query);
  const cachedData = CacheHelper.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Handle custom sorting options
  const originalSort = query.sort;
  let modifiedQuery = { ...query };

  if (query.sort) {
    switch (query.sort) {
      case "bestSelling":
        // Sort by stock_quantity (assuming higher stock means more sales)
        modifiedQuery.sort = "stock_quantity";
        break;
      case "bestRating": {
        // Use aggregation pipeline for real rating sort
        const ratingResult = await getProductsSortedByRating(query);
        CacheHelper.set(cacheKey, ratingResult, ["products"]);
        return ratingResult;
      }
      case "priceLowToHigh":
        modifiedQuery.sort = "price";
        break;
      case "priceHighToLow":
        modifiedQuery.sort = "-price";
        break;
      case "newest":
        modifiedQuery.sort = "-createdAt";
        break;
      case "oldest":
        modifiedQuery.sort = "createdAt";
        break;
      default:
        // Use the original sort parameter
        modifiedQuery.sort = originalSort;
        break;
    }
  }

  // Use QueryBuilder for advanced query operations
  // - Search in name and description fields
  // - Apply filters, sorting, pagination
  // - Populate collections array to show collection details
  const productQuery = new QueryBuilder(
    product.find().populate("collections"),
    modifiedQuery
  )
    .search(["name", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  // Add rating data to each product
  const productsWithRatings = await Promise.all(
    result.map(async (product: any) => {
      const ratingData = await ReviewServices.getAverageRatingForProduct(
        product._id.toString()
      );
      return {
        ...product.toObject(),
        averageRating: ratingData.averageRating,
        totalReviews: ratingData.totalReviews,
      };
    })
  );

  const finalResult = {
    result: productsWithRatings,
    meta,
  };
  CacheHelper.set(cacheKey, finalResult, ["products"]);
  return finalResult;
};

/**
 * Helper function to get products sorted by rating using aggregation
 */
const getProductsSortedByRating = async (query: any) => {
  // Build aggregation pipeline with rating data
  const pipeline: any[] = [
    // Add rating data from reviews collection
    {
      $lookup: {
        from: "reviews",
        localField: "_id",
        foreignField: "product",
        as: "reviews",
      },
    },
    // Calculate average rating and total reviews
    {
      $addFields: {
        averageRating: {
          $cond: {
            if: { $gt: [{ $size: "$reviews" }, 0] },
            then: {
              $divide: [{ $sum: "$reviews.rating" }, { $size: "$reviews" }],
            },
            else: 0,
          },
        },
        totalReviews: { $size: "$reviews" },
      },
    },
    // Remove the reviews array to clean up the output
    {
      $project: {
        reviews: 0,
      },
    },
  ];

  // Add search stage if searchTerm exists
  if (query.searchTerm) {
    pipeline.unshift({
      $match: {
        $or: [
          { name: { $regex: query.searchTerm, $options: "i" } },
          { description: { $regex: query.searchTerm, $options: "i" } },
        ],
      },
    });
  }

  // Add filter stages for other query parameters
  if (query.categories) {
    const categories = Array.isArray(query.categories)
      ? query.categories
      : [query.categories];
    pipeline.push({
      $match: { categories: { $in: categories } },
    });
  }

  if (query.skintype) {
    pipeline.push({
      $match: { skintype: query.skintype },
    });
  }

  if (query.ingredients) {
    const ingredients = Array.isArray(query.ingredients)
      ? query.ingredients
      : [query.ingredients];
    pipeline.push({
      $match: { ingredients: { $in: ingredients } },
    });
  }

  if (query.isFeatured) {
    pipeline.push({
      $match: { isFeatured: query.isFeatured === "true" },
    });
  }

  // Add collections lookup
  pipeline.push({
    $lookup: {
      from: "collections",
      localField: "collections",
      foreignField: "_id",
      as: "collections",
    },
  });

  // Sort by rating (descending)
  pipeline.push({
    $sort: { averageRating: -1, totalReviews: -1 },
  });

  // Add pagination
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  pipeline.push({ $skip: skip }, { $limit: limit });

  // Execute aggregation
  const result = await product.aggregate(pipeline);

  // Get total count for pagination metadata
  const countPipeline = [...pipeline];
  // Remove pagination stages for count
  countPipeline.splice(-2, 2);
  // Remove sort stage for count
  const sortIndex = countPipeline.findIndex((stage) => stage.$sort);
  if (sortIndex !== -1) {
    countPipeline.splice(sortIndex, 1);
  }

  const countResult = await product.aggregate([
    ...countPipeline,
    { $count: "total" },
  ]);

  const total = countResult.length > 0 ? countResult[0].total : 0;

  return {
    result,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

/**
 * Retrieves a single product by ID with populated collections and reviews
 * @param id - Product ID
 * @param query - Query parameters for reviews pagination (limit, page, sort)
 * @returns Promise<IProduct | null> - Single product document with reviews or null if not found
 */
const getSingleProductFromDb = async (id: string, query: any = {}) => {
  const cacheKey = CacheHelper.generateKey(`products:single:${id}`, query);
  const cachedData = CacheHelper.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Find product by ID and populate collections array to show collection details
  const productData = await product.findById(id).populate("collections");

  if (!productData) {
    return null;
  }

  // Get reviews for this product with pagination support from query parameters
  // Default pagination if not provided: limit 10, page 1, sorted by newest first
  const reviewsQuery = {
    limit: query.limit || "10",
    page: query.page || "1",
    sort: query.sort || "-createdAt",
  };

  const reviewsResult = await ReviewServices.getReviewsByProduct(
    id,
    reviewsQuery
  );

  // Get rating data
  const ratingData = await ReviewServices.getAverageRatingForProduct(id);

  // Convert product to object and add reviews and rating data
  const productWithReviews = {
    ...productData.toObject(),
    reviews: reviewsResult.result,
    reviewsMeta: reviewsResult.meta,
    averageRating: ratingData.averageRating,
    totalReviews: ratingData.totalReviews,
  };

  CacheHelper.set(cacheKey, productWithReviews, ["products", `product:${id}`]);
  return productWithReviews;
};

/**
 * Updates a product by ID with validation
 * @param id - Product ID to update
 * @param payload - Partial product data to update
 * @returns Promise<IProduct | null> - Updated product document or null if not found
 */
const updateProductIntoDb = async (id: string, payload: any) => {
  try {
    const updateData = payload;

    // Handle Cloudinary cleanup if images are being updated
    if (updateData.imagesPublicIds) {
      const existingProduct = await product.findById(id).select("imagesPublicIds");
      
      if (existingProduct?.imagesPublicIds) {
        // Find public IDs that are in the database but NOT in the new payload
        const orphans = existingProduct.imagesPublicIds.filter(
          (oldId) => !updateData.imagesPublicIds.includes(oldId)
        );

        // Delete orphaned images from Cloudinary
        if (orphans.length > 0) {
          const deletePromises = orphans.map((publicId) =>
            deleteFromCloudinary(publicId)
          );
          await Promise.all(deletePromises);
        }
      }
    }

    // Prepare the update object
    // Mongoose handles $set and $unset separately for fine-grained control
    const updateQuery: any = { $set: updateData };

    // If SKU or description is null, it means we want to clear/remove the field from the document
    if (updateData.sku === null || updateData.description === null) {
      if (updateData.sku === null) {
        delete updateData.sku;
        if (!updateQuery.$unset) updateQuery.$unset = {};
        updateQuery.$unset.sku = "";
      }
      if (updateData.description === null) {
        delete updateData.description;
        if (!updateQuery.$unset) updateQuery.$unset = {};
        updateQuery.$unset.description = "";
      }
    }

    const result = await product
      .findByIdAndUpdate(id, updateQuery, {
        new: true,
        runValidators: true,
      })
      .populate("collections");

    CacheHelper.invalidateTags(["products", `product:${id}`]);
    return result;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Hard deletes a product by ID
 * @param id - Product ID to delete
 * @returns Promise<IProduct | null> - Deleted product document or null if not found
 */
const deleteProductFromDb = async (id: string) => {
  // Fetch imagesPublicIds before deleting the document
  const existingProduct = await product.findById(id).select("imagesPublicIds");
  
  if (existingProduct?.imagesPublicIds && existingProduct.imagesPublicIds.length > 0) {
    const deletePromises = existingProduct.imagesPublicIds.map((publicId) =>
      deleteFromCloudinary(publicId)
    );
    await Promise.all(deletePromises);
  }

  // Hard delete by removing the document from database
  const result = await product.findByIdAndDelete(id);
  CacheHelper.invalidateTags(["products", `product:${id}`]);
  return result;
};

/**
 * Retrieves products that belong to a specific collection
 * @param collectionId - Collection ID to filter products by
 * @param query - Additional query parameters for search, sort, pagination
 * @returns Promise<{result: IProduct[], meta: object}> - Filtered products array and metadata
 */
const getProductsByCollection = async (collectionId: string, query: any) => {
  const cacheKey = CacheHelper.generateKey(`products:collection:${collectionId}`, query);
  const cachedData = CacheHelper.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Find products where the collections array contains the specified collectionId
  // This enables filtering products by collection for the collection-product relationship
  const productQuery = new QueryBuilder(
    product.find({ collections: collectionId }).populate("collections"),
    query
  )
    .search(["name", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  const finalResult = {
    result,
    meta,
  };
  CacheHelper.set(cacheKey, finalResult, ["products", `collection:${collectionId}`]);
  return finalResult;
};

/**
 * Retrieves related products based on categories, skin type, or ingredients
 * @param productId - Product ID to find related products for
 * @param query - Additional query parameters for pagination and limit
 * @returns Promise<{result: IProduct[], meta: object}> - Related products array and metadata
 */
const getRelatedProducts = async (productId: string, query: any = {}) => {
  const cacheKey = CacheHelper.generateKey(`products:related:${productId}`, query);
  const cachedData = CacheHelper.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // First, get the current product to understand its attributes
  const currentProduct = await product.findById(productId);

  if (!currentProduct) {
    return {
      result: [],
      meta: {
        page: 1,
        limit: query.limit || 10,
        total: 0,
        totalPage: 0,
      },
    };
  }

  // Build query to find related products
  // Priority: Same category > Same skin type > Same ingredients
  const orConditions = [];

  // Add condition for same categories
  if (currentProduct.categories && currentProduct.categories.length > 0) {
    orConditions.push({
      categories: { $in: currentProduct.categories }
    });
  }

  // Add condition for same skin type
  if (currentProduct.skintype) {
    orConditions.push({
      skintype: currentProduct.skintype
    });
  }

  // Add condition for same ingredients
  if (currentProduct.ingredients && currentProduct.ingredients.length > 0) {
    orConditions.push({
      ingredients: { $in: currentProduct.ingredients }
    });
  }

  // Build the final query
  let relatedProductsQuery = product.find({
    _id: { $ne: productId }, // Exclude the current product
    $or: orConditions.length > 0 ? orConditions : [{ isFeatured: true }] // Fallback to featured products if no attributes
  }).populate("collections");

  // Apply pagination
  const limit = parseInt(query.limit) || 10;
  const page = parseInt(query.page) || 1;
  const skip = (page - 1) * limit;

  const result = await relatedProductsQuery.skip(skip).limit(limit);

  // Add rating data to each related product
  const productsWithRatings = await Promise.all(
    result.map(async (product: any) => {
      const ratingData = await ReviewServices.getAverageRatingForProduct(
        product._id.toString()
      );
      return {
        ...product.toObject(),
        averageRating: ratingData.averageRating,
        totalReviews: ratingData.totalReviews,
      };
    })
  );

  // Get total count for pagination
  const totalCount = await product.countDocuments({
    _id: { $ne: productId },
    $or: orConditions.length > 0 ? orConditions : [{ isFeatured: true }]
  });

  const finalResult = {
    result: productsWithRatings,
    meta: {
      page,
      limit,
      total: totalCount,
      totalPage: Math.ceil(totalCount / limit),
    },
  };
  CacheHelper.set(cacheKey, finalResult, ["products", `product:${productId}`]);
  return finalResult;
};

/**
 * Retrieves featured products from the database
 * @param query - Query parameters for search, sort, pagination
 * @returns Promise<{result: IProduct[], meta: object}> - Featured products array with rating data and metadata
 */
const getFeaturedProducts = async (query: any) => {
  // Set isFeatured filter to true to get only featured products
  const featuredQuery = { ...query, isFeatured: "true" };

  // Use the existing getAllProductsFromDb method with the featured filter
  return await getAllProductsFromDb(featuredQuery);
};

/**
 * Search products by name with minimal data for fast response
 * @param searchTerm - Search term to match against product names
 * @returns Promise<Array<{_id: string, name: string, images_urls: string[]}>> - Array of minimal product data
 */
const searchProducts = async (searchTerm: string) => {
  if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim() === '') {
    return [];
  }

  const cacheKey = `products:search:${searchTerm.trim()}`;
  const cachedData = CacheHelper.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  const searchRegex = new RegExp(searchTerm, 'i'); // Case-insensitive search

  const result = await product
    .find({
      name: { $regex: searchRegex },
      isDeleted: { $ne: true }
    })
    .select('_id name images_urls')
    .lean()
    .exec();

  CacheHelper.set(cacheKey, result, ["products"]);
  return result;
};

const ProductServices = {
  createProductIntoDb,
  getAllProductsFromDb,
  getSingleProductFromDb,
  searchProducts,
  updateProductIntoDb,
  deleteProductFromDb,
  getProductsByCollection,
  getRelatedProducts,
  getFeaturedProducts,
};

export default ProductServices;
