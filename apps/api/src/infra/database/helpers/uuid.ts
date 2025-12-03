import { uuid as baseUUID } from "drizzle-orm/pg-core";

export const uuid = {
  id: baseUUID("id").primaryKey().defaultRandom(),
};
