import { RequestHandler } from "express";

import httpStatus from "http-status";
import catchAsync from "../../utils/asyncCatch";
import sendResponse from "../../utils/sendResponse";
import SettingServices from "./settings.services";

const updateAboutUs: RequestHandler = catchAsync(async (req, res) => {
  const result = await SettingServices.updateAboutUsIntoDb(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully  Updated ",
    data: result,
  });
});

const findByAboutUs: RequestHandler = catchAsync(async (req, res) => {
  const result = await SettingServices.findByAboutUsIntoDb();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Find AboutUs",
    data: result,
  });
});

const privacyPolicys: RequestHandler = catchAsync(async (req, res) => {
  const result = await SettingServices.privacyPolicysIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully  Recorded",
    data: result,
  });
});

const findByPrivacyPolicyss: RequestHandler = catchAsync(async (req, res) => {
  const result = await SettingServices.findByPrivacyPolicyssIntoDb();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Find By Privacy Policy ",
    data: result,
  });
});

const termsConditions: RequestHandler = catchAsync(async (req, res) => {
  const result = await SettingServices.termsConditionsIntoDb(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully  Recorded",
    data: result,
  });
});

const findByTermsConditions: RequestHandler = catchAsync(async (req, res) => {
  const result = await SettingServices.findBytermsConditionsIntoDb();
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Successfully Find By Terms Conditions ",
    data: result,
  });
});


const socalMediaLinksAddressPhoneEmailTexts: RequestHandler = catchAsync(
  async (req, res) => {
    const result =
      await SettingServices.socalMediaLinksAddressPhoneEmailTextsIntoDb(
        req.body,
      );
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Successfully Updated Social Media Links and Texts',
      data: result,
    });
  },
);

const findBySocalMediaLinksAddressPhoneEmailTexts: RequestHandler = catchAsync(
  async (req, res) => {
    const result =
      await SettingServices.findBySocalMediaLinksAddressPhoneEmailTextsIntoDb();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Successfully Found Social Media Links and Texts',
      data: result,
    });
  },
);

const updateHomePageSection2: RequestHandler = catchAsync(
  async (req, res) => {
    const result = await SettingServices.updateHomePageSection2IntoDb(
      req.body,
      req.files
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Successfully Updated Home Page Section 2",
      data: result,
    });
  },
);

const findByHomePageSection2: RequestHandler = catchAsync(
  async (req, res) => {
    const result = await SettingServices.findByHomePageSection2IntoDb();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Successfully Found Home Page Section 2",
      data: result,
    });
  },
);

const updateHomePageCollections: RequestHandler = catchAsync(
  async (req, res) => {
    const result = await SettingServices.updateHomePageCollectionsIntoDb(
      req.body
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Successfully Updated Home Page Collections",
      data: result,
    });
  },
);

const findByHomePageCollections: RequestHandler = catchAsync(
  async (req, res) => {
    const result = await SettingServices.findByHomePageCollectionsIntoDb();
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Successfully Found Home Page Collections",
      data: result,
    });
  },
);

const SettingController = {
  updateAboutUs,
  findByAboutUs,
  privacyPolicys,
  findByPrivacyPolicyss,
  termsConditions,
  findByTermsConditions,
  socalMediaLinksAddressPhoneEmailTexts,
  findBySocalMediaLinksAddressPhoneEmailTexts,
  updateHomePageSection2,
  findByHomePageSection2,
  updateHomePageCollections,
  findByHomePageCollections,
};

export default SettingController;
