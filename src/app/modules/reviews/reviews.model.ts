import { Schema, model, Model } from "mongoose";
import { IReview, ReviewModel, IReviewAuditLog } from "./reviews.interface";
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
    order_id: {
      type: Schema.Types.ObjectId,
      required: [true, "Order ID is required"],
      ref: "orders",
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
    status: {
      type: String,
      enum: ['active', 'flagged', 'deleted'],
      default: 'active',
      required: true,
    },
    deletedAt: {
      type: Date,
      required: false,
    },
    deletedBy: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: false,
    },
    flagReason: {
      type: String,
      required: false,
    },
    detectedKeywords: {
      type: [String],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.pre("find", function (next) {
  const query = this.getQuery();
  if (query.isDelete === undefined && query.status === undefined) {
    this.find({ isDelete: { $ne: true }, status: { $ne: 'deleted' } });
  }
  next();
});

ReviewSchema.pre("findOne", function (next) {
  const query = this.getQuery();
  if (query.isDelete === undefined && query.status === undefined) {
    this.findOne({ isDelete: { $ne: true }, status: { $ne: 'deleted' } });
  }
  next();
});

ReviewSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true }, status: { $ne: 'deleted' } } });
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

const ReviewAuditLogSchema = new Schema<IReviewAuditLog>(
  {
    adminName: {
      type: String,
      required: true,
    },
    actionType: {
      type: String,
      enum: ['approve', 'keep_flagged', 'soft_delete', 'permanent_delete'],
      required: true,
    },
    reviewId: {
      type: Schema.Types.ObjectId,
      ref: 'reviews',
      required: true,
    },
    previousStatus: {
      type: String,
      required: true,
    },
    newStatus: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ReviewAuditLog = model<IReviewAuditLog>("review_audit_logs", ReviewAuditLogSchema);

export default review;
