import { Schema, model, Model } from "mongoose";
import {
  IProduct,
  ProductModel,
  KeyIngredient,
  SkinType,
} from "./products.interface";
import AppError from "../../errors/AppError";
import status from "http-status";

const ProductSchema = new Schema<IProduct, ProductModel>(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
    },
    stock_quantity: {
      type: Number,
      min: [0, "Stock cannot be negative"],
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
    },
    product_link: {
      type: String,
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    images_urls: {
      type: [String],
      validate: {
        validator: function (urls: string[]) {
          return urls.length <= 8;
        },
        message: "Maximum 8 images allowed per product",
      },
    },
    imagesPublicIds: {
      type: [String],
      default: [],
    },
    categories: [
      {
        type: String,
        trim: true,
      },
    ],
    skintype: {
      type: String,
      enum: {
        values: ["Dry", "Oily", "Combination", "Sensitive", "Normal"],
        message:
          "Invalid skin type. Must be one of: Dry, Oily, Combination, Sensitive, Normal (case-sensitive)",
      },
    },
    ingredients: [
      {
        type: String,
        enum: {
          values: [
            "Hyaluronic Acid",
            "Vitamin C",
            "Retinol",
            "Niacinamide",
            "Peptides",
          ],
          message:
            "Invalid ingredient. Must be one of: Hyaluronic Acid, Vitamin C, Retinol, Niacinamide, Peptides (case-sensitive)",
        },
      },
    ],
    collections: [
      {
        type: Schema.Types.ObjectId,
        ref: "collections",
      },
    ],
    totalViews: {
      type: Number,
      default: 0,
    },
    totalClicks: {
      type: Number,
      default: 0,
    },
    totalAddToCart: {
      type: Number,
      default: 0,
    },
    totalWishlist: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.statics.isProductCustomId = async function (id: string) {
  const product = await this.findById(id);
  if (!product) {
    throw new AppError(status.NOT_FOUND, "Product not found", "");
  }
  return product;
};

const product = model<IProduct, ProductModel>("products", ProductSchema);

export default product;
