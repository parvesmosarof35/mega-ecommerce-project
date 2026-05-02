import { Schema, model, Model } from "mongoose";
import { IReview, ReviewModel } from "./reviews.interface";
import AppError from "../../errors/AppError";
import status from "http-status";

const ReviewSchema = new Schema<IReview, ReviewModel>(
  {
    product_id: {
      type: Schema.Types.ObjectId,
      required: [true, "Product ID is required"],
      ref: "products",
    },
    user_id: {
      type: Schema.Types.ObjectId,
      required: [true, "User ID is required"],
      ref: "users",
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
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

ReviewSchema.pre("find", function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});

ReviewSchema.pre("findOne", function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});

ReviewSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

ReviewSchema.statics.isReviewCustomId = async function (id: string) {
  const review = await this.findById(id);
  if (!review) {
    throw new AppError(status.NOT_FOUND, "Review not found", "");
  }
  return review;
};

const review = model<IReview, ReviewModel>("reviews", ReviewSchema);

export default review;
