
const AUTH_QUERY_KEY = "auth" as const;
export const authQueryKeys = queryKeysFactory(AUTH_QUERY_KEY);

import { queryKeysFactory } from "@/lib/query-key-factory";
import { z } from "zod";

export const loginDefaultValues = {
    email: "",
    password: "",
}

export const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;
