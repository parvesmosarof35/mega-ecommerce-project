import { Document, Model, Types } from "mongoose";

export interface IReview extends Document {
  id: string;
  product_id: Types.ObjectId;
  user_id: Types.ObjectId;
  rating: number; // 1-5 stars
  comment: string;
  isDelete?: boolean;
}

export type ReviewModel = {
  isReviewCustomId: (id: string) => Promise<IReview>;
} & Model<IReview>;
