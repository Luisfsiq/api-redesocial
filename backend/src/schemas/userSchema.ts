import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" })
});

export const updateUserSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }).optional(),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).optional(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).optional()
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;