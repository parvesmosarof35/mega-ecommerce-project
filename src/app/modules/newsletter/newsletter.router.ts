import express from "express";
import validationRequest from "../../middlewares/validationRequest";
import newsletterController from "./newsletter.controller";
import newsletterValidation from "./newsletter.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const routes = express.Router();

routes.post(
  "/subscribe",
  validationRequest(newsletterValidation.newsletterRequestSchema),
  newsletterController.subscribe
);

routes.get("/all", auth(USER_ROLE.admin, USER_ROLE.superAdmin), newsletterController.getAllSubscribers);
routes.delete("/delete/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), newsletterController.deleteSubscriber);

const newsletterRoutes = routes;

export default newsletterRoutes;
