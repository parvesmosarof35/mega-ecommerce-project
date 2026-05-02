import express from 'express';
import { DashboardControllers } from './dashboard.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

// Get dashboard statistics (Admin & Super Admin only)
router.get(
  '/get-stats',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  DashboardControllers.getDashboardStats
);

// Get user growth data by year (Admin & Super Admin only)
router.get(
  '/user-growth',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  DashboardControllers.getUserGrowth
);

// Get recent orders (Admin & Super Admin only)
router.get(
  '/recent-orders',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  DashboardControllers.getRecentOrders
);

// Get recent users (Admin & Super Admin only)
router.get(
  '/recent-users',
  auth(USER_ROLE.admin, USER_ROLE.superAdmin),
  DashboardControllers.getRecentUsers
);

export const DashboardRoutes = router;