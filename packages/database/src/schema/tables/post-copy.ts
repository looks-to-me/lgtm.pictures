import { relations } from 'drizzle-orm';
import {
  text,
  sqliteTable,
  integer,
  primaryKey,
} from 'drizzle-orm/sqlite-core';

import { posts } from './posts';

export const postCopies = sqliteTable('post_copies', {
  postId: text('post_id').notNull().references(() => posts.id),
  ipAddress: text('ip_address').notNull(),
  copiedAt: integer('copied_at', { mode: 'timestamp_ms' }).notNull(),
}, (t) => ({
  pk: primaryKey({ columns: [t.copiedAt, t.postId, t.ipAddress] }),
}));

export const postCopiesRelations = relations(postCopies, ({ one }) => ({
  post: one(posts),
}));
