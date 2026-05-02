import { Schema, model, Model } from "mongoose";
import { IWishlist, WishlistModel } from "./wishlists.interface";
import AppError from "../../errors/AppError";
import status from "http-status";

const WishlistSchema = new Schema<IWishlist, WishlistModel>(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "users",
    },
    product_id: {
      type: Schema.Types.ObjectId,
      required: [true, "Product ID is required"],
      ref: "products",
    },
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create a compound index to ensure a user can only add the same product once to their wishlist
WishlistSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

WishlistSchema.pre("find", function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});

WishlistSchema.pre("findOne", function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});

WishlistSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

WishlistSchema.statics.isWishlistCustomId = async function (id: string) {
  const wishlist = await this.findById(id);
  if (!wishlist) {
    throw new AppError(status.NOT_FOUND, "Wishlist item not found", "");
  }
  return wishlist;
};

const wishlist = model<IWishlist, WishlistModel>("wishlists", WishlistSchema);

export default wishlist;
