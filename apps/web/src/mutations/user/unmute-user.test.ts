import { createId } from '@paralleldrive/cuid2';

import { unmuteUser } from './unmute-user';
import { getUserMetadata } from '../../app/_libs/auth/server/get-user-metadata';
import { database } from '../../app/_libs/database';
import { schema } from '../../app/_libs/database/schema';
import { setupDatabase } from '../../app/_libs/test/setup-database';
import { setupWorker } from '../../app/_libs/test/setup-worker';

import type { MuteUserResult } from './mute-user';
import type { UnmuteUserResult } from './unmute-user';

jest.mock('next/cache');
jest.mock('@supabase/auth-helpers-nextjs');
jest.mock('../../app/_libs/auth/server/get-user-metadata');

describe('mute-user', () => {
  setupWorker();
  setupDatabase();

  const userId1 = createId();
  const userId2 = createId();

  beforeEach(async () => {
    await database()
      .insert(schema.users)
      .values({
        id: userId1,
        registeredAt: new Date(),
      });

    await database()
      .insert(schema.userProfiles)
      .values({
        userId: userId1,
        name: 'name1',
        displayName: 'displayName1',
        avatarUrl: 'avatarUrl1',
      });

    await database()
      .insert(schema.userProviders)
      .values({
        userId: userId1,
        type: 'github',
        sub: 'sub',
      });

    await database()
      .insert(schema.users)
      .values({
        id: userId2,
        registeredAt: new Date(),
      });

    await database()
      .insert(schema.userProfiles)
      .values({
        userId: userId2,
        name: 'name2',
        displayName: 'displayName2',
        avatarUrl: 'avatarUrl2',
      });

    await database()
      .insert(schema.muteUsers)
      .values({
        userId: userId1,
        muteUserId: userId2,
      });
  });

  describe('when not logged in', () => {
    beforeEach(() => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      jest.mocked(getUserMetadata).mockResolvedValue(undefined);
    });

    it('should return error if unauthorized', async () => {
      const result = await unmuteUser(userId2);

      expect(result).toEqual({
        type: 'error',
        reason: 'unauthorized',
        message: 'Login required!',
      } satisfies UnmuteUserResult);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      jest.mocked(getUserMetadata).mockResolvedValue({
        provider: 'github',
        sub: 'sub',
        name: 'name',
        user_name: 'email',
        avatar_url: 'avatar_url',
      });
    });

    it('should return error if try to mute yourself', async () => {
      const result = await unmuteUser(userId1);

      expect(result).toEqual({
        type: 'error',
        reason: 'badRequest',
        message: 'Can\'t unmute yourself!',
      } satisfies UnmuteUserResult);
    });

    it('should return error if try to mute non-existing user', async () => {
      const result = await unmuteUser(createId());

      expect(result).toEqual({
        type: 'error',
        reason: 'badRequest',
        message: 'User not found!',
      } satisfies MuteUserResult);
    });

    it('should return success when already muted', async () => {
      const result = await unmuteUser(userId2);

      expect(result).toEqual({
        type: 'success',
        message: '@name2 has been unmuted.',
      } satisfies UnmuteUserResult);
    });
  });
});
