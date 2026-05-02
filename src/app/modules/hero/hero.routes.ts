import express from "express";
import { USER_ROLE } from "../user/user.constant";
import HeroSectionController from "./hero.controller";
import HeroSectionValidationSchema from "./hero.validation";
import auth from "../../middlewares/auth";
import validationRequest from "../../middlewares/validationRequest";
import upload, { uploadToCloudinary } from "../../utils/cloudinaryUpload";

const heroRouter = express.Router();

// Get hero section (public)
heroRouter.get(
  "/get-hero-section",
  HeroSectionController.getHeroSection
);

// Update hero section (admin only) - single record system with direct Cloudinary upload
heroRouter.patch(
  "/update-hero-section",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.single("file"),
  uploadToCloudinary,
  (req, res, next) => {
    try {
      if (req.body.data && typeof req.body.data === "string") {
        req.body.data = JSON.parse(req.body.data);
      }
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Invalid JSON data in form field",
        error: error,
      });
    }
  },
  validationRequest(HeroSectionValidationSchema.updateHeroSectionSchema),
  HeroSectionController.updateHeroSection
);

export default heroRouter;
