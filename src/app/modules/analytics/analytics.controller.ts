import { Request, Response } from 'express';
import asyncCatch from '../../utils/asyncCatch';
import sendResponse from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { AnalyticsServices } from './analytics.services';

const trackVisit = asyncCatch(async (req: Request, res: Response) => {
  const { visitorId } = req.body;
  const result = await AnalyticsServices.trackVisit(visitorId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Visit tracked successfully',
    data: result,
  });
});

const trackProductEvent = asyncCatch(async (req: Request, res: Response) => {
  const { productId, eventType } = req.body;
  await AnalyticsServices.trackProductEvent(productId, eventType);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Product event tracked successfully',
    data: null,
  });
});

const getStats = asyncCatch(async (req: Request, res: Response) => {
  const result = await AnalyticsServices.getStats();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Stats retrieved successfully',
    data: result,
  });
});

export const AnalyticsControllers = {
  trackVisit,
  trackProductEvent,
  getStats,
};
