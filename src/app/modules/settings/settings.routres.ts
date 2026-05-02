import express from 'express';

import { USER_ROLE } from '../user/user.constant';

import settingValidationSchema from './settings.validation';
import SettingController from './settings.controller';
import auth from '../../middlewares/auth';
import validationRequest from '../../middlewares/validationRequest';
import upload from '../../utils/cloudinaryUpload';

const routes = express.Router();

routes.post(
  '/about',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(settingValidationSchema.AboutValidationSchema),
  SettingController.updateAboutUs,
);


routes.patch(
  '/about',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(settingValidationSchema.AboutValidationSchema),
  SettingController.updateAboutUs,
);

routes.get('/find_by_about_us', SettingController.findByAboutUs);

routes.post(
  '/privacy_policys',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(settingValidationSchema.PrivacyPolicysValidationSchema),
  SettingController.privacyPolicys,
);
routes.get(
  '/find_by_privacy_policyss',
  SettingController.findByPrivacyPolicyss,
);

routes.post(
  '/terms_conditions',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(settingValidationSchema.TermsConditionsValidationSchema),
  SettingController.termsConditions,
);
routes.get(
  '/find_by_terms_conditions',
  SettingController.findByTermsConditions,
);

// /api/v1/setting/socal_media_links_address_phone_email_texts

routes.post(
  '/socal_media_links_address_phone_email_texts',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  validationRequest(
    settingValidationSchema.SocalMediaLinksAddressPhoneEmailTextsValidationSchema,
  ),
  SettingController.socalMediaLinksAddressPhoneEmailTexts,
);

// home page seciton 2 img upload and get only will have 2 route post and get the post will also work like update 

routes.post(
  '/home-page-section-2',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  upload.fields([
    { name: 'imageone', maxCount: 1 },
    { name: 'imagetwo', maxCount: 1 },
    { name: 'imagethree', maxCount: 1 }
  ]),
  (req, res, next) => {
    try {
      // Parse form data fields
      if (req.body.title && typeof req.body.title === "string") {
        req.body.title = req.body.title.trim();
      }
      if (req.body.subtitle && typeof req.body.subtitle === "string") {
        req.body.subtitle = req.body.subtitle.trim();
      }

      // Handle uploaded images - pass file objects to service for Cloudinary upload
      if (req.files) {
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files.imageone && files.imageone[0]) {
          req.body.imageoneFile = files.imageone[0];
        }
        if (files.imagetwo && files.imagetwo[0]) {
          req.body.imagetwoFile = files.imagetwo[0];
        }
        if (files.imagethree && files.imagethree[0]) {
          req.body.imagethreeFile = files.imagethree[0];
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  },
  SettingController.updateHomePageSection2,
);

routes.get(
  '/home-page-section-2',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  SettingController.findByHomePageSection2,
);

routes.get(
  '/find_by_socal_media_links_address_phone_email_texts',
  SettingController.findBySocalMediaLinksAddressPhoneEmailTexts,
);

const SettingsRoutes = routes;

export default SettingsRoutes;