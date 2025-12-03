import { type Auth, type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth: Auth<BetterAuthOptions> = betterAuth({
  database: drizzleAdapter(
    {},
    {
      provider: "pg",
    }
  ),
});
