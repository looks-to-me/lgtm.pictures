import { relations } from 'drizzle-orm';
import { text, sqliteTable, integer, primaryKey, unique } from 'drizzle-orm/sqlite-core';

import { posts } from './posts';
import { tags } from './tags';

export const postTags = sqliteTable('post_tags', {
  postId: text('post_id').notNull().references(() => posts.id),
  tagId: text('tag_id').notNull().references(() => tags.id),
  order: integer('order').notNull(),
}, (t) => ({
  primaryKey: primaryKey({ columns: [t.postId, t.tagId] }),
  orderUnique: unique().on(t.order, t.postId),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts),
  tag: one(tags),
}));
