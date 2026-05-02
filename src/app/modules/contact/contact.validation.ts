import { z } from "zod";

const contactBodySchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(1, "Name must not be empty")
    .trim(),

  email: z
    .string({ error: "Email is required" })
    .email("Invalid email address")
    .trim(),

  question: z
    .string({ error: "Question is required" })
    .min(1, "Question must not be empty")
    .trim(),

  isDelete: z.boolean().optional(),
});

const updateBodySchema = z.object({
  name: z
    .string({ error: "Name is required" })
    .min(1, "Name must not be empty")
    .trim()
    .optional(),

  email: z
    .string({ error: "Email is required" })
    .email("Invalid email address")
    .trim()
    .optional(),

  question: z
    .string({ error: "Question is required" })
    .min(1, "Question must not be empty")
    .trim()
    .optional(),

  isDelete: z.boolean().optional(),
});

const contactRequestSchema = z.object({
  body: contactBodySchema,
});

const updateRequestSchema = z.object({
  body: updateBodySchema,
});

const contactValidation = {
  contactRequestSchema,
  updateRequestSchema,
};

export default contactValidation;
