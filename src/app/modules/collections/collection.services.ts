import collection from "./collection.model";
import { ICollection } from "./collection.interface";
import QueryBuilder from "../../builder/QueryBuilder";
import { Request } from "express";
import { CacheHelper } from "../../helper/cache";

/**
 * Creates a new collection in the database
 * @param req - Request object with collection data
 * @returns Promise<ICollection> - The created collection document
 */
const createCollectionIntoDb = async (req: Request) => {
  try {
    const data = req.body as any;

    // Handle optional slug: if null or empty string, remove it from data to avoid duplicate key error
    if (data.slug === null || data.slug === "" || data.slug === undefined) {
      delete data.slug;
    }

    const result = await collection.create(data);
    CacheHelper.invalidateTags(["collections", "products"]);
    return result;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Retrieves all collections with advanced filtering, searching, and pagination
 * @param query - Query parameters for search, filter, sort, pagination
 * @returns Promise<{result: ICollection[], meta: object}> - Collections array and metadata
 */
const getAllCollectionsFromDb = async (query: any) => {
  const cacheKey = CacheHelper.generateKey("collections:list", query);
  const cachedData = CacheHelper.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Use QueryBuilder for advanced query operations
  // - Search in name and slug fields
  // - Apply filters, sorting, pagination
  // - Populate products array to show product details
  const collectionQuery = new QueryBuilder(
    collection.find().populate("products"),
    query
  )
    .search(["name", "slug"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await collectionQuery.modelQuery;
  const meta = await collectionQuery.countTotal();

  const finalResult = {
    result,
    meta,
  };
  CacheHelper.set(cacheKey, finalResult, ["collections"]);
  return finalResult;
};

/**
 * Retrieves a single collection by ID with populated products
 * @param id - Collection ID
 * @returns Promise<ICollection | null> - Single collection document or null if not found
 */
const getSingleCollectionFromDb = async (id: string) => {
  const cacheKey = `collections:single:${id}`;
  const cachedData = CacheHelper.get(cacheKey);
  if (cachedData) {
    return cachedData;
  }

  // Find collection by ID and populate products array to show product details
  const result = await collection.findById(id).populate("products");
  CacheHelper.set(cacheKey, result, ["collections", `collection:${id}`]);
  return result;
};

/**
 * Updates a collection by ID with validation and file upload support
 * @param req - Request object with file and update data
 * @param id - Collection ID to update
 * @returns Promise<ICollection | null> - Updated collection document or null if not found
 */
const updateCollectionIntoDb = async (req: Request, id: string) => {
  try {
    const data = req.body as any;

    // Prepare the update object
    const updateQuery: any = { $set: data };

    // If slug is null or empty string, it means we want to clear/remove the field from the document
    if (data.slug === null || data.slug === "" || data.slug === undefined) {
      delete data.slug;
      updateQuery.$unset = { slug: "" };
    }

    // Find and update collection with:
    // - new: true returns the updated document
    // - runValidators: true ensures schema validation on update
    // - populate products to show updated product details
    const result = await collection
      .findByIdAndUpdate(id, updateQuery, {
        new: true,
        runValidators: true,
      })
      .populate("products");

    CacheHelper.invalidateTags(["collections", "products", `collection:${id}`]);
    return result;
  } catch (error: any) {
    throw error;
  }
};

/**
 * Hard deletes a collection by removing it from the database
 * @param id - Collection ID to delete
 * @returns Promise<ICollection | null> - Deleted collection document or null if not found
 */
const deleteCollectionFromDb = async (id: string) => {
  // Hard delete by removing the document from database
  const result = await collection.findByIdAndDelete(id);
  CacheHelper.invalidateTags(["collections", "products", `collection:${id}`]);
  return result;
};

/**
 * Adds multiple products to a collection (many-to-many relationship)
 * @param collectionId - Collection ID to add products to
 * @param productIds - Array of product IDs to add
 * @returns Promise<ICollection | null> - Updated collection with populated products
 */
const addProductsToCollection = async (
  collectionId: string,
  productIds: string[]
) => {
  // $addToSet with $each adds multiple products without duplicates
  // This prevents the same product from being added multiple times
  const result = await collection
    .findByIdAndUpdate(
      collectionId,
      { $addToSet: { products: { $each: productIds } } },
      { new: true, runValidators: true }
    )
    .populate("products");

  CacheHelper.invalidateTags(["collections", "products", `collection:${collectionId}`]);
  return result;
};

/**
 * Removes multiple products from a collection
 * @param collectionId - Collection ID to remove products from
 * @param productIds - Array of product IDs to remove
 * @returns Promise<ICollection | null> - Updated collection with populated products
 */
const removeProductsFromCollection = async (
  collectionId: string,
  productIds: string[]
) => {
  // $pullAll removes all specified product IDs from the products array
  const result = await collection
    .findByIdAndUpdate(
      collectionId,
      { $pullAll: { products: productIds } },
      { new: true }
    )
    .populate("products");

  CacheHelper.invalidateTags(["collections", "products", `collection:${collectionId}`]);
  return result;
};

const CollectionServices = {
  createCollectionIntoDb,
  getAllCollectionsFromDb,
  getSingleCollectionFromDb,
  updateCollectionIntoDb,
  deleteCollectionFromDb,
  addProductsToCollection,
  removeProductsFromCollection,
};

export default CollectionServices;
