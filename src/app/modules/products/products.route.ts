import express from "express";
import ProductControllers from "./products.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import upload from "../../utils/uploadFile";

const router = express.Router();

// Admin only routes - Create, Update, Delete products
router.post(
  "/",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  ProductControllers.createProduct
);

router.put(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  ProductControllers.updateProduct
);

router.delete(
  "/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  ProductControllers.deleteProduct
);

// Public routes - Get products
router.get("/", ProductControllers.getAllProducts);

// Fast search endpoint - returns only id, name, and first image
router.get("/search", ProductControllers.searchProducts);

router.get("/getrelatedproducts/:id", ProductControllers.getRelatedProducts);

router.get("/getfeaturedproducts", ProductControllers.getFeaturedProducts);

router.get(
  "/collection/:collectionId",
  ProductControllers.getProductsByCollection
);
router.get("/:id", ProductControllers.getSingleProduct);

export default router;
