import { Document, Model, Types } from "mongoose";

export interface IReview extends Document {
  id: string;
  product_id: Types.ObjectId;
  user_id: Types.ObjectId;
  order_id: Types.ObjectId;
  rating: number; // 1-5 stars
  comment: string;
  isDelete?: boolean;
  status: 'active' | 'flagged' | 'deleted';
  deletedAt?: Date;
  deletedBy?: Types.ObjectId;
  flagReason?: string;
  detectedKeywords?: string[];
}

export interface IReviewAuditLog extends Document {
  adminName: string;
  actionType: 'approve' | 'keep_flagged' | 'soft_delete' | 'permanent_delete';
  reviewId: Types.ObjectId;
  previousStatus: string;
  newStatus: string;
}

export type ReviewModel = {
  isReviewCustomId: (id: string) => Promise<IReview>;
} & Model<IReview>;
