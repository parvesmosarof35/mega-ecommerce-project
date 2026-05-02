import { SiteAnalytics } from './analytics.model';
import product from '../products/products.model';

const trackVisit = async (visitorId: string) => {
  const today = new Date().toISOString().split('T')[0];
  
  let stats = await SiteAnalytics.findOne({ date: today });
  
  if (!stats) {
    stats = new SiteAnalytics({ date: today });
  }

  stats.totalVisits += 1;

  if (visitorId && !stats.visitorIds.includes(visitorId)) {
    stats.visitorIds.push(visitorId);
    stats.uniqueVisitors += 1;
  }

  await stats.save();
  return stats;
};

const trackProductEvent = async (productId: string, eventType: 'view' | 'click' | 'cart' | 'wishlist') => {
  const today = new Date().toISOString().split('T')[0];
  
  // 1. Update Global Stats
  const updateSite: any = { $inc: { totalClicks: 1 } };
  if (eventType === 'cart') updateSite.$inc.totalAddToCart = 1;
  if (eventType === 'wishlist') updateSite.$inc.totalWishlist = 1;
  
  await SiteAnalytics.findOneAndUpdate(
    { date: today },
    updateSite,
    { upsert: true, new: true }
  );

  // 2. Update Individual Product Stats
  const updateProduct: any = { $inc: {} };
  if (eventType === 'view') updateProduct.$inc.totalViews = 1;
  if (eventType === 'click') updateProduct.$inc.totalClicks = 1;
  if (eventType === 'cart') updateProduct.$inc.totalAddToCart = 1;
  if (eventType === 'wishlist') updateProduct.$inc.totalWishlist = 1;

  await product.findByIdAndUpdate(productId, updateProduct);
};

const getStats = async () => {
  return await SiteAnalytics.find().sort({ date: -1 }).limit(30);
};

export const AnalyticsServices = {
  trackVisit,
  trackProductEvent,
  getStats
};
