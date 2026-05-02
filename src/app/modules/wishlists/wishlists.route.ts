import express from "express";
import WishlistControllers from "./wishlists.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Authenticated user routes - Add, Remove, Clear wishlist items
router.post("/", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), WishlistControllers.addToWishlist);
router.get("/my-wishlist", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), WishlistControllers.getMyWishlist);
router.get("/check/:productId", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), WishlistControllers.checkIfProductInWishlist);
router.delete("/product/:productId", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), WishlistControllers.removeFromWishlist);


router.delete("/clear", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), WishlistControllers.clearMyWishlist);
router.get("/count", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), WishlistControllers.getMyWishlistCount);

export default router;
