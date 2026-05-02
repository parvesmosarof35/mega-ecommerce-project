import { Model } from "mongoose";

export type THeroSection = {
  title: string;
  subtitle: string;
  description: string;
  backgroundImage: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  isActive: boolean;
};

export interface HeroSectionModel extends Model<THeroSection> {
  findActiveHeroSection(): Promise<THeroSection | null>;
}
