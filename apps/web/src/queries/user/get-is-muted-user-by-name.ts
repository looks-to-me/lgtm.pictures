import { schema } from '@looks-to-me/package-database';
import { and, eq } from 'drizzle-orm';

import { getLoginUser } from './get-login-user';
import { database } from '../../app/_libs/database';

import type { User } from '../../repositories/user-repository';

export const getIsMutedUserByName = async (
  name: User['profile']['name'],
): Promise<boolean> => {
  const loginUser = await getLoginUser();
  if (!loginUser) return false;

  const existMuteUser = await database()
    .select({
      id: schema.muteUsers.userId,
    })
    .from(schema.muteUsers)
    .innerJoin(
      schema.userProfiles,
      and(
        eq(schema.userProfiles.userId, schema.muteUsers.muteUserId),
        eq(schema.userProfiles.name, name),
      ),
    )
    .where(eq(schema.muteUsers.userId, loginUser.id))
    .get();
  return !!existMuteUser;
};
