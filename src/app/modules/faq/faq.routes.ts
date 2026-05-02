import express from "express";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";
import validationRequest from "../../middlewares/validationRequest";
import FaqValidation from "./faq.validation";
import FaqController from "./faq.controller";

const routes = express.Router();

routes.post(
  "/create_faq",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(FaqValidation.createFaqZodSchema),
  FaqController.createFAQ
);

routes.get("/findB_by_all_faq", FaqController.findByAllFaq);

routes.get("/find_by_specific_faq/:id", FaqController.findBySpecificFaq);

routes.patch(
  "/update_faq/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(FaqValidation.updateFaqZodSchema),
  FaqController.updateFaq
);

routes.delete(
  "/delete_faq/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  FaqController.deleteFaq
);

const FaqRoutes = routes;
export default FaqRoutes;
