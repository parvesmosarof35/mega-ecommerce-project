import { Document, Model, Schema } from "mongoose";

// Predefined ingredient options for future queries (case-sensitive)
export type KeyIngredient =
  | "Hyaluronic Acid"
  | "Vitamin C"
  | "Retinol"
  | "Niacinamide"
  | "Peptides";

// Predefined skin type options for future queries (case-sensitive)
export type SkinType = "Dry" | "Oily" | "Combination" | "Sensitive" | "Normal";

// Sorting options for products
export type SortOption =
  | "bestSelling"
  | "bestRating"
  | "priceLowToHigh"
  | "priceHighToLow"
  | "newest"
  | "oldest";

export interface IProduct extends Document {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock_quantity?: number;
  sku?: string; // Stock Keeping Unit
  product_link?: string; // Product link
  isFeatured?: boolean; // Featured product flag
  images_urls: string[];
  imagesPublicIds?: string[];
  categories?: string[];
  skintype?: SkinType; // Single skin type from predefined options (case-sensitive)
  ingredients?: KeyIngredient[]; // Array of key ingredients from predefined options (case-sensitive)
  collections?: string[]; // Array of collection IDs (optional)
}

export type ProductModel = {
  isProductCustomId: (id: string) => Promise<IProduct>;
} & Model<IProduct>;
