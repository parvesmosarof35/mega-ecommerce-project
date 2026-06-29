import { z } from "zod";

const newsletterRequestSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
  }),
});

const newsletterValidation = {
  newsletterRequestSchema,
};

export default newsletterValidation;
