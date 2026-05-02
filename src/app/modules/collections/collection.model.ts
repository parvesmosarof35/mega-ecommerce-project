import { Schema, model, Model } from "mongoose";
import { ICollection, CollectionModel } from "./collection.interface";
import AppError from "../../errors/AppError";
import status from "http-status";

const CollectionSchema = new Schema<ICollection, CollectionModel>(
  {
    name: {
      type: String,
      required: [true, "Collection name is required"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },
    image_url: {
      type: String,
      required: false,
    },
    imagePublicId: {
      type: String,
      required: false,
    },
    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "products",
      },
    ],
    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

CollectionSchema.pre("find", function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});

CollectionSchema.pre("findOne", function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});

CollectionSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

CollectionSchema.statics.isCollectionCustomId = async function (id: string) {
  const collection = await this.findById(id);
  if (!collection) {
    throw new AppError(status.NOT_FOUND, "Collection not found", "");
  }
  return collection;
};

const collection = model<ICollection, CollectionModel>(
  "collections",
  CollectionSchema
);

export default collection;
