import { z } from "zod";

 const createBlogSchema = z.object({
  body: z
    .object({
      blogTitle: z.string({ error: "Blog title is required" }).trim(),
      photo: z.string({ error: "Photo is required" }).optional(),
      content: z.string({ error: "Content is required" }).trim(),
      isDelete: z.boolean().optional().default(false),
    })
    .optional(),
});

 const updateBlogSchema = z.object({
  body: z
    .object({
      blogTitle: z.string().trim().optional(),
      photo: z.string().optional(),
      content: z.string().trim().optional(),
      isDelete: z.boolean().optional(),
    })
    .optional(),
});

const BlogsValidation = {
  createBlogSchema,
  updateBlogSchema,
};

export default BlogsValidation;
