import httpStatus from "http-status";
import AppError from "../../errors/AppError";
import HeroSection from "./hero.model";
import { THeroSection } from "./hero.interface";
import {
  deleteFromCloudinary,
} from "../../utils/cloudinary";

const getHeroSectionFromDb = async () => {
  try {
    // Get the first hero section or create default if none exists
    let result = await HeroSection.findOne();
    
    if (!result) {
      // Create default hero section if none exists
      const defaultHeroSection: THeroSection = {
        title: "Elevate Your Beauty, <br /> Naturally",
        subtitle: "Dermatologically tested, crafted with pure ingredients.",
        description: "Dermatologically tested, crafted with pure ingredients.",
        backgroundImage: "/images/hero-bg.png",
        primaryButtonText: "Explore Products",
        primaryButtonLink: "/products",
        secondaryButtonText: "Shop Now",
        secondaryButtonLink: "/shop",
        isActive: true,
      };
      
      result = await HeroSection.create(defaultHeroSection);
    }
    
    return result;
  } catch (error: any) {
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to get hero section",
      error
    );
  }
};

const updateHeroSectionIntoDb = async (req: any) => {
  try {
    const file = req.file;
    const data = req.body.data || {};
    const cloudinaryUrl = req.body.cloudinaryUrl;

    // Find the first hero section
    let heroSection = await HeroSection.findOne();
    
    if (!heroSection) {
      throw new AppError(httpStatus.NOT_FOUND, "Hero section not found", "");
    }

    const updateData: Partial<THeroSection> = {};

    // Handle text data
    if (data.title) updateData.title = data.title;
    if (data.subtitle) updateData.subtitle = data.subtitle;
    if (data.description) updateData.description = data.description;
    if (data.primaryButtonText) updateData.primaryButtonText = data.primaryButtonText;
    if (data.primaryButtonLink) updateData.primaryButtonLink = data.primaryButtonLink;
    if (data.secondaryButtonText) updateData.secondaryButtonText = data.secondaryButtonText;
    if (data.secondaryButtonLink) updateData.secondaryButtonLink = data.secondaryButtonLink;

    // Handle Cloudinary URL (uploaded directly to Cloudinary)
    if (cloudinaryUrl) {
      const existingHero = await HeroSection.findOne().select("backgroundImage");
      
      updateData.backgroundImage = cloudinaryUrl;

      // Delete old image from Cloudinary if it exists and is not the default
      if (existingHero?.backgroundImage && 
          !existingHero.backgroundImage.includes("/images/hero-bg.png")) {
        try {
          // Extract public_id from URL if possible
          const publicId = existingHero.backgroundImage.split('/').pop()?.split('.')[0];
          if (publicId) {
            await deleteFromCloudinary(`hero-sections/${publicId}`);
          }
        } catch {}
      }
    }

    if (Object.keys(updateData).length === 0) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        "No data provided for update",
        ""
      );
    }

    // Update existing hero section
    const updatedHeroSection = await HeroSection.findByIdAndUpdate(
      heroSection._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedHeroSection) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update hero section", "");
    }

    return updatedHeroSection;
  } catch (error: any) {
    if (error instanceof AppError) throw error;
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      "Failed to update hero section",
      error
    );
  }
};

const HeroSectionServices = {
  getHeroSectionFromDb,
  updateHeroSectionIntoDb,
};

export default HeroSectionServices;
