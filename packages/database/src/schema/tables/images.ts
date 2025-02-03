import { relations } from 'drizzle-orm';
import { text, sqliteTable, integer } from 'drizzle-orm/sqlite-core';

import { posts } from './posts';
import { users } from './users';

export const images = sqliteTable('images', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  width: integer('width').notNull(),
  height: integer('height').notNull(),
  uploadedAt: integer('uploaded_at', { mode: 'timestamp_ms' }).notNull(),
});

export const imagesRelations = relations(images, ({ one, many }) => ({
  user: one(users),
  posts: many(posts),
}));
