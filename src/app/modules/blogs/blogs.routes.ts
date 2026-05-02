import express, { NextFunction, Request, Response } from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import upload from "../../utils/uploadFile";
import AppError from "../../errors/AppError";
import status from "http-status";
import validationRequest from "../../middlewares/validationRequest";
import BlogsValidation from "./blogs.validation";
import BlogsControllers from "./blogs.controller";

const routes = express.Router();
routes.post(
  "/create_blogs",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(BlogsValidation.createBlogSchema),
  BlogsControllers.createBlogs
);

routes.get("/find_by_all_blogs", BlogsControllers.findByAllBlogs);

routes.get("/find_by_specific_blogs/:id", BlogsControllers.findBySpecificBlogs);

routes.patch(
  "/update_blog/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(BlogsValidation.updateBlogSchema),
  BlogsControllers.updateBlogs
);

routes.delete(
  "/delete_blogs/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  BlogsControllers.deleteBlogs
);

routes.get("/recent_blog", BlogsControllers.recentBlog);

const BlogsRoutes = routes;

export default BlogsRoutes;
