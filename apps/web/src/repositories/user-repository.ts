'use server';

import { schema } from '@looks-to-me/package-database';
import { eq, sql } from 'drizzle-orm';

import { database } from '../app/_libs/database';

export type User = {
  id: string;
  profile: {
    name: string;
    displayName: string | null;
    avatarUrl: string;
  };
};

export const saveUser = async (user: User): Promise<User> => {
  // TODO: Make use of transaction or batch.
  // @see: https://github.com/drizzle-team/drizzle-orm/issues/758
  {
    await database()
      .insert(schema.users)
      .values({
        id: user.id,
        registeredAt: new Date(),
      })
      .onConflictDoUpdate({
        target: schema.users.id,
        set: {
          registeredAt: sql`excluded.registered_at`,
        },
      })
      .run();

    await database()
      .insert(schema.userProfiles)
      .values({
        userId: user.id,
        name: user.profile.name,
        displayName: user.profile.displayName,
        avatarUrl: user.profile.avatarUrl,
      })
      .onConflictDoUpdate({
        target: schema.userProfiles.userId,
        set: {
          name: sql`excluded.name`,
          displayName: sql`excluded.display_name`,
          avatarUrl: sql`excluded.avatar_url`,
        },
      })
      .run();
  }

  return user;
};

export const findUserById = async (id: User['id']): Promise<User | undefined> => {
  return database()
    .select({
      id: schema.users.id,
      profile: {
        name: schema.userProfiles.name,
        displayName: schema.userProfiles.displayName,
        avatarUrl: schema.userProfiles.avatarUrl,
      },
    })
    .from(schema.users)
    .innerJoin(schema.userProfiles, eq(schema.users.id, schema.userProfiles.userId))
    .where(eq(schema.users.id, id))
    .get();
};

export const findUserByName = async (name: User['profile']['name']): Promise<User | undefined> => {
  return database()
    .select({
      id: schema.users.id,
      profile: {
        name: schema.userProfiles.name,
        displayName: schema.userProfiles.displayName,
        avatarUrl: schema.userProfiles.avatarUrl,
      },
    })
    .from(schema.users)
    .innerJoin(schema.userProfiles, eq(schema.users.id, schema.userProfiles.userId))
    .where(eq(schema.userProfiles.name, name))
    .get();
};
