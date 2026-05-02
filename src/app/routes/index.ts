import express from "express";
import contactRoutes from "../modules/contact/contact.router";
import AuthRouter from "../modules/auth/auth.routes";
import UserRouters from "../modules/user/user.routes";
import SettingsRoutes from "../modules/settings/settings.routres";
import BlogsRoutes from "../modules/blogs/blogs.routes";
import FaqRoutes from "../modules/faq/faq.routes";
import ProductRoutes from "../modules/products/products.route";
import CollectionRoutes from "../modules/collections/collection.route";
import ReviewRoutes from "../modules/reviews/reviews.route";
import WishlistRoutes from "../modules/wishlists/wishlists.route";
import CartRoutes from "../modules/cart/cart.route";
import PaymentRoutes from "../modules/payment/payment.routes";
import OrderRoutes from "../modules/order/order.routes";
import { DashboardRoutes } from "../modules/dashboardstats/dashboard.router";
import heroRouter from "../modules/hero/hero.routes";



const router = express.Router();

const moduleRoutes = [
  {
    path: "/contact",
    route: contactRoutes,
  },
  {
    path: "/auth",
    route: AuthRouter,
  },
  {
    path: "/user",
    route: UserRouters,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/collection",
    route: CollectionRoutes,
  },
  {
    path: "/review",
    route: ReviewRoutes,
  },
  {
    path: "/wishlist",
    route: WishlistRoutes,
  },
  {
    path: "/cart",
    route: CartRoutes,
  },
  {
    path: "/payment",
    route: PaymentRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
  {
    path: "/setting",
    route: SettingsRoutes,
  },
  {
    path: "/hero",
    route: heroRouter,
  },
  {
    path: "/blogs",
    route: BlogsRoutes,
  },
  {
    path: "/faq",
    route: FaqRoutes,
  },
  {
    path: "/dashboard",
    route: DashboardRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
