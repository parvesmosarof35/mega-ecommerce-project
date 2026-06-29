import { Router } from 'express';
import OrderController from './order.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

// Public routes (guest checkout)
router.post('/guest', OrderController.createGuestOrder);

// Authenticated user routes (viewing own orders)
router.get('/my-orders/:customerId', auth(USER_ROLE.buyer, USER_ROLE.seller, USER_ROLE.admin, USER_ROLE.superAdmin), OrderController.getOrdersByCustomerId);

// Admin routes (require admin authentication)
router.get('/', auth(USER_ROLE.admin, USER_ROLE.superAdmin), OrderController.getAllOrders);
router.get('/:orderId', auth(USER_ROLE.admin, USER_ROLE.superAdmin), OrderController.getOrderById);
router.patch('/:orderId/status', auth(USER_ROLE.admin, USER_ROLE.superAdmin), OrderController.updateOrderStatus);
router.patch('/:orderId/payment-status', auth(USER_ROLE.admin, USER_ROLE.superAdmin), OrderController.updatePaymentStatus);
router.patch('/:orderId/cancel', auth(USER_ROLE.admin, USER_ROLE.superAdmin), OrderController.cancelOrder);

export default router;