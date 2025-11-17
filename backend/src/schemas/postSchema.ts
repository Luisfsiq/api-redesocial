import { z } from "zod";

export const createPostSchema = z.object({
  content: z.string().min(1, "Content is required"),
  image: z.string().optional(),
  authorId: z.string().min(1, "Author ID is required")
});

export const updatePostSchema = z.object({
  content: z.string().min(1).optional(),
  image: z.string().optional()
});

export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
