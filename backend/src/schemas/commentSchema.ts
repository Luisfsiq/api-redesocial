import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(1, { message: "Comment content cannot be empty" }),
  postId: z.number().int().positive(),
  authorId: z.number().int().positive()
});

export const updateCommentSchema = z.object({
  content: z.string().min(1, { message: "Comment content cannot be empty" }).optional()
});

export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;