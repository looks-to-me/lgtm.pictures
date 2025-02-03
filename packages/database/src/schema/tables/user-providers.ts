import { relations } from 'drizzle-orm';
import { text, sqliteTable, unique } from 'drizzle-orm/sqlite-core';

import { users } from './users';

export const userProviders = sqliteTable('user_providers', {
  userId: text('user_id').notNull().references(() => users.id),
  type: text('type').notNull(),
  sub: text('sub').notNull(),
}, (t) => ({
  subUnique: unique().on(t.type, t.sub),
}));

export const userProvidersRelations = relations(userProviders, ({ one }) => ({
  user: one(users),
}));
