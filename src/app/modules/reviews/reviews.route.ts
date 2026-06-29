import express from "express";
import ReviewControllers from "./reviews.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Admin only routes
router.get("/analytics", auth(USER_ROLE.admin, USER_ROLE.superAdmin), ReviewControllers.getReviewAnalytics);
router.get("/audit-logs", auth(USER_ROLE.admin, USER_ROLE.superAdmin), ReviewControllers.getReviewAuditLogs);
router.patch("/status/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), ReviewControllers.updateReviewStatus);
router.patch("/bulk-status", auth(USER_ROLE.admin, USER_ROLE.superAdmin), ReviewControllers.bulkUpdateReviewStatuses);
router.delete("/admin/:id/permanent", auth(USER_ROLE.superAdmin), ReviewControllers.permanentDeleteReview);
router.delete("/admin/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), ReviewControllers.deleteReview);

// Authenticated user routes - Create, Update, Delete reviews
router.post("/", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), ReviewControllers.createReview);
router.put("/:id", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), ReviewControllers.updateReview);
router.delete("/:id", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), ReviewControllers.deleteReview);

// Public routes - Get reviews
router.get("/", ReviewControllers.getAllReviews);
router.get("/:id", ReviewControllers.getSingleReview);
router.get("/product/:productId", ReviewControllers.getReviewsByProduct);
router.get("/user/:userId", ReviewControllers.getReviewsByUser);
router.get("/average-rating/:productId", ReviewControllers.getAverageRatingForProduct);

export default router;