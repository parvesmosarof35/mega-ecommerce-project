import { RequestHandler } from "express";

import httpStatus from "http-status";
import catchAsync from "../../utils/asyncCatch";
import AuthServices from "./auth.service";
import config from "../../config";
import sendResponse from "../../utils/sendResponse";

const loginUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.loginUserIntoDb(req.body);

  const { refreshToken, accessToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Login",
    data: {
      accessToken,
    },
  });
});

const refreshToken: RequestHandler = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;
  const result = await AuthServices.refreshTokenIntoDb(refreshToken);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Access token is Retrived Successfully",
    data: result,
  });
});

const myprofile: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.myprofileIntoDb(req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully find my profile",
    data: result,
  });
});

const chnageMyProfile: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.changeMyProfileIntoDb(
    req as any,
    req.user.id
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Change My Profile",
    data: result,
  });
});

const findByAllUsersAdmin: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.findByAllUsersAdminIntoDb(req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Find All Users",
    data: result,
  });
});

const deleteAccount: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.deleteAccountIntoDb(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Delete your account ",
    data: result,
  });
});

const isBlockAccount: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.isBlockAccountIntoDb(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Change Status ",
    data: result,
  });
});


const find_by_all_admin: RequestHandler = catchAsync(async (req, res) => {


  const result = await AuthServices.find_by_all_admin_IntoDb(req.user.id, req.query);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Find By All Admin ",
    data: result,
  });


})

const getSingleUserById: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.getSingleUserByIdIntoDb(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Find Single User",
    data: result,
  });
});

const googleLogin: RequestHandler = catchAsync(async (req, res) => {
  const result = await AuthServices.googleLoginIntoDb(req.body);

  const { refreshToken, accessToken } = result;
  res.cookie("refreshToken", refreshToken, {
    secure: config.NODE_ENV === "production",
    httpOnly: true,
  });
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Login with Google",
    data: {
      accessToken,
    },
  });
});

const AuthController = {
  loginUser,
  refreshToken,
  myprofile,
  chnageMyProfile,
  findByAllUsersAdmin,
  deleteAccount,
  isBlockAccount,
  find_by_all_admin,
  getSingleUserById,
  googleLogin,
};

export default AuthController;
