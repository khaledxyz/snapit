import { user } from "@modules/auth/auth.schema";

import { relations } from "drizzle-orm";
import { index, integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const url = pgTable(
  "url",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull().unique(),
    originalUrl: text("original_url").notNull(),
    title: text("title"),
    description: text("description"),
    passwordHash: text("password_hash"),
    clickCount: integer("click_count").default(0).notNull(),
    expiresAt: timestamp("expires_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
    userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("url_code_idx").on(table.code),
    index("url_userId_idx").on(table.userId),
  ]
);

export const urlClick = pgTable(
  "url_click",
  {
    id: text("id").primaryKey(),
    urlId: text("url_id")
      .notNull()
      .references(() => url.id, { onDelete: "cascade" }),
    clickedAt: timestamp("clicked_at").defaultNow().notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    referer: text("referer"),
  },
  (table) => [
    index("url_click_urlId_idx").on(table.urlId),
    index("url_click_clickedAt_idx").on(table.clickedAt),
  ]
);

export const urlRelations = relations(url, ({ one, many }) => ({
  user: one(user, {
    fields: [url.userId],
    references: [user.id],
  }),
  clicks: many(urlClick),
}));

export const urlClickRelations = relations(urlClick, ({ one }) => ({
  url: one(url, {
    fields: [urlClick.urlId],
    references: [url.id],
  }),
}));
