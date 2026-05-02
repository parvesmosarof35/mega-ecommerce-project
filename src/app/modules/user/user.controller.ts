import { RequestHandler } from "express";
import httpStatus from "http-status";
import UserServices from "./user.service";
import sendResponse from "../../utils/sendResponse";
import catchAsync from "../../utils/asyncCatch";

const createUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.createUserIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Change Onboarding Status",
    data: result,
  });
});
const userVarification: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.userVarificationIntoDb(
    req.body.verificationCode
  );
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Varified Your Account",
    data: result,
  });
});

const chnagePassword: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.chnagePasswordIntoDb(req.body, req.user.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Change Password",
    data: result,
  });
});

const forgotPassword: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.forgotPasswordIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Send Email",
    data: result,
  });
});

const verificationForgotUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.verificationForgotUserIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Verify User",
    data: result,
  });
});

const resetPassword: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.resetPasswordIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Reset Password",
    data: result,
  });
});


const getUserGrowth: RequestHandler = catchAsync(async (req, res) => {

  const result = await UserServices.getUserGrowthIntoDb(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully  Find User Growth",
    data: result,
  });

});

const recently_joined_user: RequestHandler = catchAsync(async (req, res) => {

  const result = await UserServices.recently_joined_user_IntoDb(req.query);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully  Find  Recent Joined User",
    data: result,
  });


});

const deleteAllTypesOfUser: RequestHandler = catchAsync(async (req, res) => {

  const result = await UserServices.deleteAllTypesOfUserIntoDb(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Delete  ",
    data: result,
  });
})

const createGuestUser: RequestHandler = catchAsync(async (req, res) => {
  const result = await UserServices.createGuestUserIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully created guest user",
    data: result,
  });
});

const UserController = {
  createUser,
  userVarification,
  chnagePassword,
  forgotPassword,
  verificationForgotUser,
  resetPassword,
  getUserGrowth,
  recently_joined_user,
  deleteAllTypesOfUser,
  createGuestUser
};

export default UserController;
