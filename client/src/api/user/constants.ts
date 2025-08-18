import { z } from "zod";
import { queryKeysFactory } from "@/lib/query-key-factory";

const USERS_QUERY_KEY = "users" as const;
export const usersQueryKeys = queryKeysFactory(USERS_QUERY_KEY);

export const providerSchema = z.object({
  name: z.string(),
  id: z.string(),
  email: z.string().email().optional(),
  username: z.string().optional(),
  connectedAt: z.string(),
});

export const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string(),
  providers: z.array(providerSchema),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type User = z.infer<typeof userSchema>;

export const createUserDefaultValues = {
  email: "",
  password: "",
};

export const createUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  displayName: z
    .string()
    .min(2, "Display name must be at least 2 characters")
    .optional(),
  email: z.string().email("Please enter a valid email address").optional(),
  newPassword: z
    .string()
    .min(8, "New password must be at least 8 characters")
    .optional(),
  currentPassword: z.string().min(8, "Current password is required").optional(),
});
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
