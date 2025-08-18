// Import all table definitions
import { users } from '../users/schemas/user.schema';
import { urls } from '../urls/schemas/url.schema';

// Re-export all individual schema exports for convenience
export * from '../users/schemas/user.schema';
export * from '../urls/schemas/url.schema';

// Combined schema object for Drizzle - this is what you pass to drizzle()
export const schema = {
  users,
  urls,
} as const;

// Export the schema type for TypeScript inference
export type DatabaseSchema = typeof schema;

// Re-export tables individually for direct access
export { users, urls };
