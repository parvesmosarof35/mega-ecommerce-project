import { Schema, model, Model } from "mongoose";
import { ICart, ICartModel } from "./cart.interface";
import AppError from "../../errors/AppError";
import status from "http-status";

const CartSchema = new Schema<ICart, ICartModel>(
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
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
      default: 1,
    },
    price_at_addition: {
      type: Number,
      required: [true, "Price at addition is required"],
      min: [0, "Price cannot be negative"],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure unique combination of user and product
CartSchema.index({ user_id: 1, product_id: 1 }, { unique: true });

CartSchema.statics.isCartCustomId = async function (id: string) {
  const cartItem = await this.findById(id);
  if (!cartItem) {
    throw new AppError(status.NOT_FOUND, "Cart item not found", "");
  }
  return cartItem;
};

const cart = model<ICart, ICartModel>("carts", CartSchema);

export default cart;
