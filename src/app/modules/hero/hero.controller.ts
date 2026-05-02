import { RequestHandler } from "express";
import httpStatus from "http-status";
import catchAsync from "../../utils/asyncCatch";
import HeroSectionServices from "./hero.service";
import sendResponse from "../../utils/sendResponse";

const getHeroSection: RequestHandler = catchAsync(async (req, res) => {
  const result = await HeroSectionServices.getHeroSectionFromDb();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Hero section retrieved successfully",
    data: result,
  });
});

const updateHeroSection: RequestHandler = catchAsync(async (req, res) => {
  const result = await HeroSectionServices.updateHeroSectionIntoDb(req as any);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Hero section updated successfully",
    data: result,
  });
});

const HeroSectionController = {
  getHeroSection,
  updateHeroSection,
};

export default HeroSectionController;
