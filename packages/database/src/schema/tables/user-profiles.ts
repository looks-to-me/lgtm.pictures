import { relations } from 'drizzle-orm';
import { text, sqliteTable } from 'drizzle-orm/sqlite-core';

import { users } from './users';

export const userProfiles = sqliteTable('user_profiles', {
  userId: text('user_id').notNull().unique().references(() => users.id),
  name: text('name').notNull(),
  displayName: text('display_name'),
  avatarUrl: text('avatar_url').notNull(),
});

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
  user: one(users),
}));
