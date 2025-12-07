import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL,
  basePath: "/api/auth",
  trustedOrigins: [import.meta.env.VITE_CLIENT_URL],
});
