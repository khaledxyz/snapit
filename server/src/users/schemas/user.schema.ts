import { pgTable, text, jsonb, uuid } from 'drizzle-orm/pg-core';
import { timestamps } from '../../database/columns.helpers';

export interface Provider {
  name: string;
  id: string;
  email?: string;
  username?: string;
  connectedAt: Date;
}

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  displayName: text('display_name').notNull().default(''),
  email: text('email').notNull().unique(),
  password: text('password').notNull().default(''),
  providers: jsonb('providers').$type<Provider[]>().default([]),
  ...timestamps,
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
