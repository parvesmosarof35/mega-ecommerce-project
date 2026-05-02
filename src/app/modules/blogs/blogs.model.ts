import { Schema, model } from "mongoose";
import { TBlogs, BlogsModel } from "./blogs.interface";
import AppError from "../../errors/AppError";
import status from "http-status";

const TBlogsSchema = new Schema<TBlogs, BlogsModel>(
  {
    blogTitle: {
      type: String,
      required: [true, "Blog title is required"],
      trim: true,
    },
    adminId: {
      type: Schema.Types.ObjectId,
      required: [true, "adminId is required"],
      ref: "users",
    },
    photo: {
      type: String,
      required: [true, "Photo is required"],
    },
    photoPublicId: {
      type: String,
      required: false,
    },
    content: {
      type: String,
      required: [true, "Content is required"],
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

TBlogsSchema.pre("find", function (next) {
  this.find({ isDelete: { $ne: true } });
  next();
});

TBlogsSchema.pre("findOne", function (next) {
  this.findOne({ isDelete: { $ne: true } });
  next();
});
TBlogsSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { isDelete: { $ne: true } } });
  next();
});

TBlogsSchema.statics.isBlogsCustomId = async function (id: string) {
  const blog = await this.findById(id);
  if (!blog) {
    throw new AppError(status.NOT_FOUND, "not founded", "");
  }
  return blog;
};
const blogs = model<TBlogs, BlogsModel>("blogs", TBlogsSchema);

export default blogs;
