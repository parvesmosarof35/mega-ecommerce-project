import { z } from "zod";
import { THeroSection } from "./hero.interface";

const heroDataSchema = z.object({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  description: z.string().optional(),
  primaryButtonText: z.string().optional(),
  primaryButtonLink: z.string().optional(),
  secondaryButtonText: z.string().optional(),
  secondaryButtonLink: z.string().optional(),
});

const updateHeroSectionSchema = z.object({
  body: z.object({
    data: heroDataSchema.optional(), // Parsed object for hero section data
  }),
  file: z.object({
    originalname: z.string().optional(),
    buffer: z.any().optional(),
    mimetype: z.string().optional(),
  }).optional(),
});

const HeroSectionValidationSchema = {
  updateHeroSectionSchema,
};

export default HeroSectionValidationSchema;
