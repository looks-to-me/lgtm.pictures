import { eq } from 'drizzle-orm';

import { deleteUserPermanently } from './delete-user-permanently';
import { getUserMetadata } from '../../app/_libs/auth/server/get-user-metadata';
import { database } from '../../app/_libs/database';
import { schema } from '../../app/_libs/database/schema';
import { createProductionLikeUserData } from '../../app/_libs/database/seed/create-production-like-test-data';
import { setupDatabase } from '../../app/_libs/test/setup-database';
import { setupWorker } from '../../app/_libs/test/setup-worker';

import type { DeleteUserPermanentlyResult } from './delete-user-permanently';
import type { UserMetadata } from '../../app/_libs/auth/type/user-metadata';

jest.mock('@supabase/auth-helpers-nextjs');
jest.mock('../../app/_libs/auth/server/get-user-metadata');
jest.mock('next/cache');

const getUserDataByUserId = async (userId: string) => {
  return await Promise.all([
    database().select().from(schema.users).where(eq(schema.users.id, userId)).get(),
    database().select().from(schema.images).where(eq(schema.images.userId, userId)).get(),
    database().select().from(schema.muteUsers).where(eq(schema.muteUsers.userId, userId)).get(),
    database().select().from(schema.muteUsers).where(eq(schema.muteUsers.muteUserId, userId)).get(),
    database().select().from(schema.posts).where(eq(schema.posts.userId, userId)).get(),
    database().select().from(schema.userProfiles).where(eq(schema.userProfiles.userId, userId)).get(),
    database().select().from(schema.userProviders).where(eq(schema.userProviders.userId, userId)).get(),
  ]);
};

describe('delete-user-permanently', () => {
  setupWorker();
  setupDatabase();
  let userId1: string;
  let userId2: string;
  beforeEach(async () => {
    const { user: user1 } = await createProductionLikeUserData();
    const { user: user2 } = await createProductionLikeUserData();
    userId1 = user1.id;
    userId2 = user2.id;

  });
  describe('when not logged in', () => {
    beforeEach(() => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      jest.mocked(getUserMetadata).mockResolvedValue(undefined);
    });

    it('should return error if unauthorized', async () => {
      const result = await deleteUserPermanently();
      expect(result).toEqual({
        type:'error',
        reason: 'unauthorized',
        message: expect.any(String),
      } satisfies DeleteUserPermanentlyResult);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      jest.mocked(getUserMetadata).mockResolvedValue({
        provider: 'github',
        sub: `sub-${userId1}`,
        name: 'name',
        user_name: 'user_name',
        avatar_url: 'avatar_url',
      } satisfies UserMetadata);
    });

    it('should delete all data for user1 and not delete data for user2.', async () => {
      const user1DataBeforeDelete = await getUserDataByUserId(userId1);
      for (const datum of user1DataBeforeDelete) {
        expect(datum).toBeDefined();
      }
      const user2DataBeforeDelete = await getUserDataByUserId(userId1);
      for (const datum of user2DataBeforeDelete) {
        expect(datum).toBeDefined();
      }

      const result = await deleteUserPermanently();

      expect(result).toEqual({
        type:'success',
        message: expect.any(String),
      } satisfies DeleteUserPermanentlyResult);

      const user1DataAfterDelete = await getUserDataByUserId(userId1);
      for (const datum of user1DataAfterDelete) {
        expect(datum).toBeUndefined();
      }

      const user2DataAfterDelete = await getUserDataByUserId(userId2);
      for (const datum of user2DataAfterDelete) {
        expect(datum).toBeDefined();
      }
    });
  });

});
