import { queryKeysFactory } from "@/lib/query-key-factory";
import { z } from "zod";

const URLS_QUERY_KEY = "urls" as const;
export const urlsQueryKeys = queryKeysFactory(URLS_QUERY_KEY);

export const createShortUrlSchema = z.object({
  longUrl: z.string().url(),
  shortCode: z
    .string()
    .regex(/^[0-9a-zA-Z]*$/, {
      message:
        "Short code may only contain alphanumeric characters (0-9, a-z, A-Z)",
    })
    .optional(),
  description: z.string().optional(),
  password: z.string().optional(),
});
export type CreateShortUrlInput = z.infer<typeof createShortUrlSchema>;

export const shortUrlSchema = z.object({
  id: z.string(),
  originalUrl: z.string().url(),
  shortCode: z.string(),
  clicks: z.number().default(0),
  description: z.string().optional(),
  passwordProtected: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type ShortUrl = z.infer<typeof shortUrlSchema>;
