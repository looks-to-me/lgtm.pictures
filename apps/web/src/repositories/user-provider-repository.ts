import { schema } from '@looks-to-me/package-database';
import { and, eq, sql } from 'drizzle-orm';

import { database } from '../app/_libs/database';

export type UserProvider = {
  userId: string;
  type: string;
  sub: string;
};

export const saveUserProvider = async (userProvider: UserProvider): Promise<UserProvider> => {
  await database()
    .insert(schema.userProviders)
    .values({
      userId: userProvider.userId,
      type: userProvider.type,
      sub: userProvider.sub,
    })
    .onConflictDoUpdate({
      target: [
        schema.userProviders.type,
        schema.userProviders.sub,
      ],
      set: {
        userId: sql`excluded.user_id`,
      },
    })
    .run();

  return userProvider;
};

export const findUserProviderByTypeAndSub = async (
  type: UserProvider['type'],
  sub: UserProvider['sub'],
): Promise<UserProvider | undefined> => {
  return database()
    .select()
    .from(schema.userProviders)
    .where(
      and(
        eq(schema.userProviders.type, type),
        eq(schema.userProviders.sub, sub),
      ),
    )
    .get();
};
