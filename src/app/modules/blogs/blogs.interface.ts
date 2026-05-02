import { Model, Types } from "mongoose";

export type BlogsResponse = {
  status: boolean;
  message: string;
} | null;

export type TBlogs = {
  blogTitle: string;
  photo: string;
  photoPublicId?: string;
  content: string;
  isDelete: boolean;
  adminId: Types.ObjectId;
};

export interface BlogsModel extends Model<TBlogs> {
  // eslint-disable-next-line no-unused-vars
  isBlogsCustomId(id: string): Promise<TBlogs>;
}
