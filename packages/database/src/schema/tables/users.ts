import { relations } from 'drizzle-orm';
import { text, sqliteTable, integer } from 'drizzle-orm/sqlite-core';

import { images } from './images';
import { muteUsers } from './mute-users';
import { posts } from './posts';
import { userProfiles } from './user-profiles';
import { userProviders } from './user-providers';

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  registeredAt: integer('registered_at', { mode: 'timestamp_ms' }).notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(userProfiles),
  providers: many(userProviders),
  images: many(images),
  posts: many(posts),
  muteUsers: many(muteUsers),
}));
