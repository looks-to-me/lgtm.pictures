import { schema } from '@looks-to-me/package-database';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';

import { getLoginUser } from './get-login-user';
import { database } from '../../app/_libs/database';

export type MutedUser = {
  id: string;
  profile: {
    name: string;
    displayName: string | null;
  };
};

export const getMutedUsers = async (): Promise<MutedUser[]> => {
  const loginUser = await getLoginUser();
  if (!loginUser) redirect('/login');

  return database()
    .select({
      id: schema.muteUsers.muteUserId,
      profile: {
        name: schema.userProfiles.name,
        displayName: schema.userProfiles.displayName,
      },
    })
    .from(schema.muteUsers)
    .innerJoin(schema.userProfiles, eq(schema.userProfiles.userId, schema.muteUsers.muteUserId))
    .where(eq(schema.muteUsers.userId, loginUser.id));
};
