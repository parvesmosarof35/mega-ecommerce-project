import status from "http-status";
import AppError from "../../errors/AppError";
import { BlogsResponse, TBlogs } from "./blogs.interface";
import blogs from "./blogs.model";
import QueryBuilder from "../../builder/QueryBuilder";
import { search_query } from "./blogs.constant";
import { Request } from "express";

const createBlogsIntoDb = async (
  req: Request,
  adminId: string
): Promise<BlogsResponse> => {
  try {
    const data = req.body as any;

    const blogsBuilder = new blogs({ ...data, adminId: adminId as any });
    const result = await blogsBuilder.save();

    return result && { status: true, message: "successfully recorded" };
  } catch (error: any) {
    throw new AppError(
      status.SERVICE_UNAVAILABLE,
      error.message || "createBlogsIntoDb section unavailable",
      ""
    );
  }
};

const findByAllBlogsIntoDb = async (query: Record<string, unknown>) => {
  try {
    const allBlogsQuery = new QueryBuilder(
      blogs.find({}).select("-isDelete -updatedAt"),
      query
    )
      .search(search_query)
      .filter()
      .sort()
      .paginate()
      .fields();

    const allBlogsList = await allBlogsQuery.modelQuery;
    const meta = await allBlogsQuery.countTotal();
    return { meta, allBlogsList };
  } catch (error: any) {
    throw new AppError(
      error.statusCode || status.SERVICE_UNAVAILABLE,
      error.message || "Failed  all blogs list",
      error
    );
  }
};

const findBySpecificBlogsIntoDb = async (id: string) => {
  try {
    return await blogs
      .findById(id)
      .populate("adminId", {
        fullname: 1,
        photo: 1,
      })
      .select("-isDelete  -updatedAt");
  } catch (error: any) {
    throw new AppError(
      error.statusCode || status.SERVICE_UNAVAILABLE,
      error.message || "Failed find by  specific blogs list",
      error
    );
  }
};

const updateBlogsIntoDb = async (
  req: Request,
  id: string
): Promise<BlogsResponse> => {
  try {
    const updateData = req.body as any;

    if (Object.keys(updateData).length === 0) {
      throw new AppError(status.BAD_REQUEST, "No data provided for update");
    }

    const result = await blogs.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    );

    
    if (!result) {
      throw new AppError(status.NOT_FOUND, "Blog not found");
    }

    return (
      result && {
        status: true,
        message: "Successfully updated blog",
      }
    );
  } catch (error: any) {
    throw new AppError(
      error.statusCode || status.SERVICE_UNAVAILABLE,
      error.message || "Failed  update blogs ",
      error
    );
  }
};

const deleteBlogsIntoDb = async (id: string) => {
  try {
    const isExistBlogs = await blogs.exists({ _id: id });

    if (!isExistBlogs) {
      throw new AppError(status.NOT_FOUND, "blogs not founded", "");
    }

    const result = await blogs.findByIdAndDelete(id);
    return result && { status: true, message: "successfully delete" };
  } catch (error: any) {
    throw new AppError(
      error.statusCode || status.SERVICE_UNAVAILABLE,
      error.message || "Failed delete blogs ",
      error
    );
  }
};

const recentBlogIntoDb = async () => {
  try {
    const result = await blogs
      .find({})
      .select("-isDelete -createdAt -updatedAt")
      .sort({ createdAt: -1 })
      .limit(3);

    return result;
  } catch (error: any) {
    throw new AppError(
      error.statusCode || status.SERVICE_UNAVAILABLE,
      error.message || "Failed recent blog section",
      error
    );
  }
};

const BlogsServices = {
  createBlogsIntoDb,
  findByAllBlogsIntoDb,
  findBySpecificBlogsIntoDb,
  updateBlogsIntoDb,
  deleteBlogsIntoDb,
  recentBlogIntoDb,
};

export default BlogsServices;
