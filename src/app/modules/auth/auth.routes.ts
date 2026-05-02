import express, { NextFunction, Request, Response } from "express";
import AuthController from "./auth.controller";
import LoginValidationSchema from "./auth.validation";
import validationRequest from "../../middlewares/validationRequest";
import { USER_ROLE } from "../user/user.constant";
import auth from "../../middlewares/auth";
import upload from "../../utils/uploadFile";
import AppError from "../../errors/AppError";
import httpStatus from "http-status";

const router = express.Router();

router.post(
  "/login_user",
  validationRequest(LoginValidationSchema.LoginSchema),
  AuthController.loginUser
);

router.post(
  "/login_with_google",
  validationRequest(LoginValidationSchema.googleLoginSchema),
  AuthController.googleLogin
);

router.post(
  "/refresh-token",
  validationRequest(LoginValidationSchema.requestTokenValidationSchema),
  AuthController.refreshToken
);

router.get(
  "/myprofile",
  auth(USER_ROLE.admin, USER_ROLE.buyer, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest),
  AuthController.myprofile
);

// Routes file
router.patch(
  "/update_my_profile",
  auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest),
  validationRequest(LoginValidationSchema.changeMyProfileSchema),
  AuthController.chnageMyProfile
);

router.get(
  "/find_by_admin_all_users",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AuthController.findByAllUsersAdmin
);

router.get(
  "/get_single_user/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AuthController.getSingleUserById
);

router.delete(
  "/delete_account/:id",
  auth(USER_ROLE.seller, USER_ROLE.buyer, USER_ROLE.buyer, USER_ROLE.admin, USER_ROLE.superAdmin),
  AuthController.deleteAccount
);

//  changeUserAccountStatus

router.patch(
  "/change_status/:id",
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(LoginValidationSchema.changeUserAccountStatus),
  AuthController.isBlockAccount
);


router.get("/find_by_all_admin", auth(USER_ROLE.admin, USER_ROLE.superAdmin), AuthController.find_by_all_admin);




const AuthRouter = router;
export default AuthRouter;
