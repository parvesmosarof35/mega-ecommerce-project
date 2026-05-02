import { Model, Schema, Document } from "mongoose";

export interface ICart {
  user_id: Schema.Types.ObjectId;
  product_id: Schema.Types.ObjectId;
  quantity: number;
  price_at_addition: number; // Store price when added to cart
}

export interface ICartModel extends Model<ICart> {
  isCartCustomId: (id: string) => Promise<ICart>;
}

export interface CartDocument extends ICart, Document {
  createdAt?: Date;
  updatedAt?: Date;
}
