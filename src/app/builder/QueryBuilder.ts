import { FilterQuery, Query } from "mongoose";

class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public query: Record<string, unknown>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, unknown>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]) {
    const searchTerm = this?.query?.searchTerm;

    if (searchTerm) {
      const searchConditions: any[] = [];

      searchableFields.forEach((field) => {
        const schemaPath = this.modelQuery.model.schema.path(field);
        
        if (schemaPath && schemaPath.instance === "String") {
          // String fields - use regex search
          searchConditions.push({
            [field]: { $regex: searchTerm, $options: "i" },
          });
        } else if (field === '_id') {
          // ObjectId field - try to convert to ObjectId for exact match
          try {
            const { ObjectId } = require('mongoose');
            if (ObjectId.isValid(searchTerm)) {
              searchConditions.push({
                [field]: new ObjectId(searchTerm),
              });
            }
          } catch (error) {
            // Invalid ObjectId, skip this field
          }
        }
      });

      if (searchConditions.length > 0) {
        this.modelQuery = this.modelQuery.find({
          $or: searchConditions,
        });
      }
    }

    return this;
  }

  filter() {
    let queryObject = { ...this.query };
    
    // Exclude pagination, sort, and custom filter fields
    const excludeFields = ["searchTerm", "sort", "limit", "page", "fields", "minPrice", "maxPrice", "maxpricerange", "releaseDate", "maxprice", "collections"];
    excludeFields.forEach((el) => delete queryObject[el]);

    // Robustly handle flat bracket keys (e.g. "price[gte]") manually to support shallow query parsers
    Object.keys(queryObject).forEach(key => {
      const match = key.match(/^(\w+)\[(\w+)\]$/);
      if (match) {
        const [, field, operator] = match;
        if (!queryObject[field]) {
          queryObject[field] = {};
        }
        if (typeof queryObject[field] === 'object' && queryObject[field] !== null) {
          (queryObject[field] as Record<string, unknown>)[operator] = queryObject[key];
        }
        delete queryObject[key];
      }
    });

    // Handle categories filtering with $in
    if (this.query?.categories) {
      const categories = Array.isArray(this.query.categories) 
        ? this.query.categories 
        : [this.query.categories];
      queryObject.categories = { $in: categories };
    }

    // Handle collections filtering with $in
    if (this.query?.collections) {
      const collections = Array.isArray(this.query.collections) 
        ? this.query.collections 
        : [this.query.collections];
      queryObject.collections = { $in: collections };
    }

    // Handle skintype filtering with $in
    if (this.query?.skintype) {
      const skinTypes = Array.isArray(this.query.skintype) 
        ? this.query.skintype 
        : [this.query.skintype];
      queryObject.skintype = { $in: skinTypes };
    }

    // Handle ingredients filtering with $in
    if (this.query?.ingredients) {
      const ingredients = Array.isArray(this.query.ingredients) 
        ? this.query.ingredients 
        : [this.query.ingredients];
      queryObject.ingredients = { $in: ingredients };
    }

    // Handle maxprice
    if (this.query?.maxprice) {
      if (!queryObject.price) queryObject.price = {};
      (queryObject.price as any).$lte = Number(this.query?.maxprice);
    }

    // Advanced filtering: Convert gt, gte, lt, lte to mongo operators ($gt, $gte, etc.)
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(
      /"(gt|gte|lt|lte)":/g,
      (match) => match.replace('"', '"$')
    );

    this.modelQuery = this.modelQuery.find(JSON.parse(queryStr) as FilterQuery<T>);
    return this;
  }

  sort() {
    const sort =
      (this?.query?.sort as string)?.split(",").join(" ") || "-createdAt";
    this.modelQuery = this.modelQuery.sort(sort as string);
    return this;
  }

  

  paginate() {
    const limit = Math.max(Number(this.query.limit) || 10, 1);
    const page = Math.max(Number(this.query.page) || 1, 1);
    const skip = (page - 1) * limit;
    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  fields() {
    const field =
      (this?.query?.fields as string)?.split(",").join(" ") || "-__v";
    this.modelQuery = this.modelQuery.select(field);
    return this;
  }

  async countTotal() {
    const totalQueries = this.modelQuery.getFilter();
    const total = await this.modelQuery.model.countDocuments(totalQueries);
    const page = Number(this?.query?.page) || 1;
    const limit = Number(this?.query?.limit) || 10;
    const totalPage = Math.ceil(total / limit);

    return {
      page,
      limit,
      total,
      totalPage,
    };
  }
}

export default QueryBuilder;
