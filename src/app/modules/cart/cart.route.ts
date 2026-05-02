import express from "express";
import CartControllers from "./cart.controller";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const router = express.Router();

// Authenticated user routes - Add, Update, Remove, Clear cart items
router.post("/", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), CartControllers.addToCart);
router.get("/", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), CartControllers.getMyCart);
router.get("/check/:productId", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), CartControllers.checkIfProductInCart);
router.delete("/clear", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), CartControllers.clearMyCart);
router.delete("/product/:productId", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), CartControllers.removeFromCart);
router.put("/product/:productId", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), CartControllers.updateCartItemQuantity);
router.delete("/:id", auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), CartControllers.deleteCartItem);

export default router;