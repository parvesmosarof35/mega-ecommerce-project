import { Schema, model, Document } from 'mongoose';

export interface ISiteAnalytics extends Document {
  date: string; // YYYY-MM-DD
  totalVisits: number;
  uniqueVisitors: number;
  visitorIds: string[]; // To track unique visitors for the day
  totalClicks: number;
  totalAddToCart: number;
  totalWishlist: number;
}

const SiteAnalyticsSchema = new Schema<ISiteAnalytics>({
  date: { type: String, required: true, unique: true },
  totalVisits: { type: Number, default: 0 },
  uniqueVisitors: { type: Number, default: 0 },
  visitorIds: { type: [String], default: [] },
  totalClicks: { type: Number, default: 0 },
  totalAddToCart: { type: Number, default: 0 },
  totalWishlist: { type: Number, default: 0 },
}, { timestamps: true });

export const SiteAnalytics = model<ISiteAnalytics>('SiteAnalytics', SiteAnalyticsSchema);
