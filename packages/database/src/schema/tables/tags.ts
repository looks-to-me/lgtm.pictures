import { relations } from 'drizzle-orm';
import { text, sqliteTable } from 'drizzle-orm/sqlite-core';

import { postTags } from './post-tags';

export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
});

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));
