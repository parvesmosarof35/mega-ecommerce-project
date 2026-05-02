import express from "express";
import validationRequest from "../../middlewares/validationRequest";
import contactController from "./contact.controller";
import contactValidation from "./contact.validation";
import auth from "../../middlewares/auth";
import { USER_ROLE } from "../user/user.constant";

const routes = express.Router();

routes.post(
  "/create_contact",
  validationRequest(contactValidation.contactRequestSchema),
  contactController.createContact
);

routes.get("/all_contact", auth(USER_ROLE.admin, USER_ROLE.superAdmin), contactController.all_contact);
routes.get("/specific_contact/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), contactController.specificContact);
routes.patch(
  "/update_contact/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(contactValidation.updateRequestSchema),
  contactController.updateContact
);

routes.delete("/delete_contact/:id", auth(USER_ROLE.admin, USER_ROLE.superAdmin), contactController.deleteContact);

const contactRoutes = routes;

export default contactRoutes;
