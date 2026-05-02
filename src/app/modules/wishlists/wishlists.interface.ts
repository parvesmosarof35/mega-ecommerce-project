import { Document, Model, Types } from "mongoose";

export interface IWishlist extends Document {
  id: string;
  user_id: Types.ObjectId;
  product_id: Types.ObjectId;
  isDelete?: boolean;
}

export type WishlistModel = {
  isWishlistCustomId: (id: string) => Promise<IWishlist>;
} & Model<IWishlist>;
