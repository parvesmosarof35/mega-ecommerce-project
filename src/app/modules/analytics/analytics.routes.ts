import express from 'express';
import { AnalyticsControllers } from './analytics.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/track-visit', AnalyticsControllers.trackVisit);
router.post('/track-product-event', AnalyticsControllers.trackProductEvent);

// Admin only can see stats
router.get(
  '/stats',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  AnalyticsControllers.getStats
);

export const AnalyticsRoutes = router;
