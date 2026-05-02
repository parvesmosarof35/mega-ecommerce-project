import { Router } from 'express';
import OrderController from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

// Public routes (if needed for guest checkout)
// router.post('/guest', OrderController.createGuestOrder);

// Protected routes (require authentication)
router.post('/create', auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), OrderController.createOrder);
router.get('/my-orders/:customerId', auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), OrderController.getOrdersByCustomerId);
router.get('/:orderId', auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin, USER_ROLE.guest), OrderController.getOrderById);

// Admin routes (require admin authentication)
router.get('/', auth(USER_ROLE.admin, USER_ROLE.superAdmin), OrderController.getAllOrders);
router.patch('/:orderId/status', auth(USER_ROLE.admin, USER_ROLE.superAdmin), OrderController.updateOrderStatus);
router.patch('/:orderId/payment-status', auth(USER_ROLE.admin, USER_ROLE.superAdmin), OrderController.updatePaymentStatus);
router.patch('/:orderId/cancel', auth(USER_ROLE.admin, USER_ROLE.superAdmin), OrderController.cancelOrder);

export default router;