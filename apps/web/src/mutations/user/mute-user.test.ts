import { schema } from '@looks-to-me/package-database';
import { createId } from '@paralleldrive/cuid2';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { muteUser } from './mute-user';
import { getUserMetadata } from '../../app/_libs/auth/server/get-user-metadata';
import { database } from '../../app/_libs/database';
import { setupDatabase } from '../../app/_libs/test/setup-database';
import { setupWorker } from '../../app/_libs/test/setup-worker';

import type { MuteUserResult } from './mute-user';

vi.mock('next/cache');
vi.mock('@supabase/auth-helpers-nextjs');
vi.mock('../../app/_libs/auth/server/get-user-metadata');

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
  });

  describe('when not logged in', () => {
    beforeEach(() => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      vi.mocked(getUserMetadata).mockResolvedValue(undefined);
    });

    it('should return error if unauthorized', async () => {
      const result = await muteUser(userId2);

      expect(result).toEqual({
        type: 'error',
        reason: 'unauthorized',
        message: 'Login required!',
      } satisfies MuteUserResult);
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      vi.mocked(getUserMetadata).mockResolvedValue({
        provider: 'github',
        sub: 'sub',
        name: 'name',
        user_name: 'email',
        avatar_url: 'avatar_url',
      });
    });

    it('should return error if try to mute yourself', async () => {
      const result = await muteUser(userId1);

      expect(result).toEqual({
        type: 'error',
        reason: 'badRequest',
        message: 'Can\'t mute yourself!',
      } satisfies MuteUserResult);
    });

    it('should return error if try to mute non-existing user', async () => {
      const result = await muteUser(createId());

      expect(result).toEqual({
        type: 'error',
        reason: 'badRequest',
        message: 'User not found!',
      } satisfies MuteUserResult);
    });

    it('should return success if try to mute someone else', async () => {
      const result = await muteUser(userId2);

      expect(result).toEqual({
        type: 'success',
        message: '@name2 has been muted.',
      } satisfies MuteUserResult);
    });
  });
});
