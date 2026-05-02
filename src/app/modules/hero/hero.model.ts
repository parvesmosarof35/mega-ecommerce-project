import { Schema, model } from "mongoose";
import { THeroSection, HeroSectionModel } from "./hero.interface";

const HeroSectionSchema = new Schema<THeroSection, HeroSectionModel>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    subtitle: {
      type: String,
      required: [true, "Subtitle is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    backgroundImage: {
      type: String,
      required: [true, "Background image is required"],
      default: "/images/hero-bg.png",
    },
    primaryButtonText: {
      type: String,
      required: [true, "Primary button text is required"],
      trim: true,
    },
    primaryButtonLink: {
      type: String,
      required: [true, "Primary button link is required"],
      trim: true,
    },
    secondaryButtonText: {
      type: String,
      required: [true, "Secondary button text is required"],
      trim: true,
    },
    secondaryButtonLink: {
      type: String,
      required: [true, "Secondary button link is required"],
      trim: true,
    },
    isActive: {
      type: Boolean,
      required: [true, "Active status is required"],
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Static method to find active hero section
HeroSectionSchema.statics.findActiveHeroSection = async function (): Promise<THeroSection | null> {
  return this.findOne({ isActive: true }).sort({ createdAt: -1 });
};

const HeroSection = model<THeroSection, HeroSectionModel>("HeroSection", HeroSectionSchema);

export default HeroSection;
