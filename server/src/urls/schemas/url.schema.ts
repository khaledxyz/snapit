import { pgTable, text, integer, uuid, serial } from 'drizzle-orm/pg-core';
import { timestamps } from '../../database/columns.helpers';
import { users } from '../../users/schemas/user.schema';

export const urls = pgTable('urls', {
  id: serial('id').primaryKey(),
  originalUrl: text('original_url').notNull(),
  shortCode: text('short_code').notNull().unique(),
  clicks: integer('clicks').default(0).notNull(),
  description: text('description').default('').notNull(),
  password: text('password').default('').notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'set null' }),
  ...timestamps,
});

export type Url = typeof urls.$inferSelect;
export type NewUrl = typeof urls.$inferInsert;
