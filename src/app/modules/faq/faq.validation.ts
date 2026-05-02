import { z } from "zod";
import { question_type } from "./faq.constant";

const createFaqZodSchema = z.object({
  body: z.object({
    question: z
      .string({ error: "Question is required" })
      .trim()
      .min(1, "Question cannot be empty"),

    answer: z
      .string({ error: "Answer is required" })
      .trim()
      .min(1, "Answer cannot be empty"),

    question_type: z
      .enum([
        question_type.general,
        question_type.buying,
        question_type.selling,
        question_type.valuation,
      ])
      .optional(),

    isDelete: z.boolean().optional().default(false),
  }),
});

const updateFaqZodSchema = z.object({
  body: z.object({
    question: z.string().trim().optional(),
    answer: z.string().trim().optional(),
    question_type: z
      .enum([
        question_type.general,
        question_type.buying,
        question_type.selling,
        question_type.valuation,
      ])
      .optional(),
    isDelete: z.boolean().optional(),
  }),
});

const FaqValidation = {
  createFaqZodSchema,
  updateFaqZodSchema,
};
export default FaqValidation;
