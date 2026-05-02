import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import BlogsServices from "./blogs.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const createBlogs: RequestHandler = catchAsync(async (req, res) => {
  const result = await BlogsServices.createBlogsIntoDb(
    req as any,
    req?.user?.id
  );
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Successfully  Recorded ",
    data: result,
  });
});

const findByAllBlogs: RequestHandler = catchAsync(async (req, res) => {
  const result = await BlogsServices.findByAllBlogsIntoDb(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Successfully Find All Blogs",
    data: result,
  });
});

const findBySpecificBlogs: RequestHandler = catchAsync(async (req, res) => {
  const result = await BlogsServices.findBySpecificBlogsIntoDb(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Successfully Find By Blogs Details",
    data: result,
  });
});

const updateBlogs: RequestHandler = catchAsync(async (req, res) => {
  const result = await BlogsServices.updateBlogsIntoDb(
    req as any,
    req.params.id
  );
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Successfully Updated",
    data: result,
  });
});

const deleteBlogs: RequestHandler = catchAsync(async (req, res) => {
  const result = await BlogsServices.deleteBlogsIntoDb(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Successfully Delete",
    data: result,
  });
});

const recentBlog: RequestHandler = catchAsync(async (req, res) => {
  const result = await BlogsServices.recentBlogIntoDb();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Successfully Find Recent Blog",
    data: result,
  });
});

const BlogsControllers = {
  createBlogs,
  findByAllBlogs,
  findBySpecificBlogs,
  updateBlogs,
  deleteBlogs,
  recentBlog,
};

export default BlogsControllers;
