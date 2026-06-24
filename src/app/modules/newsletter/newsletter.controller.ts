import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import { newsletterServices } from "./newsletter.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const subscribe: RequestHandler = catchAsync(async (req, res) => {
  const result = await newsletterServices.createNewsletterIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully Subscribed!",
    data: result,
  });
});

const getAllSubscribers: RequestHandler = catchAsync(async (req, res) => {
  const result = await newsletterServices.allNewsletterIntoDb();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Fetched Subscribers",
    data: result,
  });
});

const deleteSubscriber: RequestHandler = catchAsync(async (req, res) => {
  const result = await newsletterServices.deleteNewsletterIntoDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Deleted Subscriber",
    data: result,
  });
});

const newsletterController = {
  subscribe,
  getAllSubscribers,
  deleteSubscriber,
};
export default newsletterController;
