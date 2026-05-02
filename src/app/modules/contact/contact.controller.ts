import { RequestHandler } from "express";
import catchAsync from "../../utils/asyncCatch";
import contactServices from "./contact.services";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const createContact: RequestHandler = catchAsync(async (req, res) => {
  const result = await contactServices.createContactIntoDb(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Successfully  Recorded ",
    data: result,
  });
});

const all_contact: RequestHandler = catchAsync(async (req, res) => {
  const result = await contactServices.all_contact_IntoDb(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Find All Contact",
    data: result,
  });
});

const specificContact: RequestHandler = catchAsync(async (req, res) => {
  const result = await contactServices.specificContactIntoDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Find Specific Contact",
    data: result,
  });
});

const updateContact: RequestHandler = catchAsync(async (req, res) => {
  const result = await contactServices.updateContactIntoDb(
    req.params.id,
    req.body
  );
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Update Contact",
    data: result,
  });
});

const deleteContact: RequestHandler = catchAsync(async (req, res) => {
  const result = await contactServices.deleteContactIntoDb(req.params.id);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Successfully Delete Contact",
    data: result,
  });
});

const contactController = {
  createContact,
  all_contact,
  specificContact,
  updateContact,
  deleteContact
};
export default contactController;
