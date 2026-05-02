import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import FaqServices from "./faq.services";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const createFAQ: RequestHandler = catchAsync(async (req, res) => {
  const result = await FaqServices.createFAQIntoDb(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Successfully Create Faq ",
    data: result,
  });
});

const findByAllFaq: RequestHandler = catchAsync(async (req, res) => {
  const result = await FaqServices.findByAllFaqIntoDb(req.query);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Successfully Find All Faq",
    data: result,
  });
});

const findBySpecificFaq: RequestHandler = catchAsync(async (req, res) => {
  const result = await FaqServices.findBySpecificFaqIntoDb(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Successfully Find  By Specific  Faq",
    data: result,
  });
});

const updateFaq: RequestHandler = catchAsync(async (req, res) => {
  const result = await FaqServices.updateFaqIntoDb(req.params.id, req.body);

  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Successfully Update  Faq",
    data: result,
  });
});

const deleteFaq: RequestHandler = catchAsync(async (req, res) => {
  const result = await FaqServices.deleteFaqIntoDb(req.params.id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Successfully Delete  Faq",
    data: result,
  });
});

const FaqController = {
  createFAQ,
  findByAllFaq,
  findBySpecificFaq,
  updateFaq,
  deleteFaq,
};

export default FaqController;
