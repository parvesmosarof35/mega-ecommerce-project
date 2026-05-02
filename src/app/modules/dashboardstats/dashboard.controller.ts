import { Request, Response } from 'express';
import { USER_ROLE } from '../user/user.constant';
import Product from '../products/products.model';
import User from '../user/user.model';
import Order from '../order/order.model';
import Collection from '../collections/collection.model';
import httpStatus from 'http-status';

// Simple catchAsync utility
const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: any) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
};

// Simple sendResponse utility
const sendResponse = (
  res: Response,
  data: {
    statusCode: number;
    success: boolean;
    message: string;
    data?: any;
    error?: string;
  }
) => {
  res.status(data.statusCode).json({
    success: data.success,
    message: data.message || null,
    data: data.data || null,
    error: data.error || null,
  });
};

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
  try {
    // Get total products count
    const totalProducts = await Product.countDocuments();
    
    // Get total orders count
    const totalOrders = await Order.countDocuments();
    
    // Get total customers count (users with buyer role)
    const totalCustomers = await User.countDocuments({ role: 'buyer' });
    
    // Get total collections count
    const totalCollections = await Collection.countDocuments();

    // Get recent orders (last 5)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('customerId', 'fullname email')
      .populate('items.productId', 'name price');

    // Get top selling products
    const topSellingProducts = await Product.aggregate([
      { $sort: { sold: -1 } },
      { $limit: 5 },
      { $project: { name: 1, price: 1, sold: 1, images: { $slice: ['$images', 1] } } }
    ]);

    const stats = {
      summary: {
        totalProducts,
        totalOrders,
        totalCustomers,
        totalCollections,
      },
      recentOrders,
      topSellingProducts,
    };

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Dashboard stats retrieved successfully',
      data: stats,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Error retrieving dashboard stats',
      error: (error as Error).message,
    });
  }
});

const getUserGrowth = catchAsync(async (req: Request, res: Response) => {
  try {
    const { year } = req.query;
    
    if (!year || isNaN(Number(year))) {
      return sendResponse(res, {
        statusCode: httpStatus.BAD_REQUEST,
        success: false,
        message: 'Valid year parameter is required',
      });
    }

    const targetYear = Number(year);
    const startDate = new Date(`${targetYear}-01-01T00:00:00.000Z`);
    const endDate = new Date(`${targetYear}-12-31T23:59:59.999Z`);

    // Aggregate users by month for the specified year
    const monthlyUserGrowth = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          totalUsers: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.month': 1 },
      },
    ]);

    // Initialize all months with 0 users
    const monthlyData = [
      { month: 'Jan', totalUsers: 0 },
      { month: 'Feb', totalUsers: 0 },
      { month: 'Mar', totalUsers: 0 },
      { month: 'Apr', totalUsers: 0 },
      { month: 'May', totalUsers: 0 },
      { month: 'Jun', totalUsers: 0 },
      { month: 'Jul', totalUsers: 0 },
      { month: 'Aug', totalUsers: 0 },
      { month: 'Sep', totalUsers: 0 },
      { month: 'Oct', totalUsers: 0 },
      { month: 'Nov', totalUsers: 0 },
      { month: 'Dec', totalUsers: 0 },
    ];

    // Map the aggregated data to the monthly data
    monthlyUserGrowth.forEach((item) => {
      const monthIndex = item._id.month - 1;
      if (monthIndex >= 0 && monthIndex < 12) {
        monthlyData[monthIndex].totalUsers = item.totalUsers;
      }
    });

    const totalUsers = monthlyData.reduce((sum, item) => sum + item.totalUsers, 0);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User growth data retrieved successfully',
      data: {
        year: targetYear,
        totalUsers,
        monthlyData,
      },
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Error retrieving user growth data',
      error: (error as Error).message,
    });
  }
});

const getRecentOrders = catchAsync(async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .populate('customerId', 'fullname email')
      .populate('items.productId', 'name price')
      .select('customerId status createdAt totalAmount items');

    const formattedOrders = recentOrders.map(order => {
      const customer = order.customerId as any;
      return {
        orderNumber: `#LUN-${String(order._id).slice(-3).toUpperCase()}`,
        customerName: customer?.fullname || 'Unknown',
        status: order.status,
        date: order.createdAt.toISOString().split('T')[0],
        totalAmount: order.totalAmount,
        items: order.items
      };
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Recent orders retrieved successfully',
      data: formattedOrders,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Error retrieving recent orders',
      error: (error as Error).message,
    });
  }
});

const getRecentUsers = catchAsync(async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    
    const recentUsers = await User.find({ role: 'buyer' })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .select('fullname email createdAt')
      .lean();

    const formattedUsers = recentUsers.map((user: any) => ({
      name: user.fullname,
      email: user.email,
      registrationDate: user.createdAt ? user.createdAt.toISOString().split('T')[0] : 'Unknown'
    }));

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Recent users retrieved successfully',
      data: formattedUsers,
    });
  } catch (error) {
    sendResponse(res, {
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      success: false,
      message: 'Error retrieving recent users',
      error: (error as Error).message,
    });
  }
});

export const DashboardControllers = {
  getDashboardStats,
  getUserGrowth,
  getRecentOrders,
  getRecentUsers,
};