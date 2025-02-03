import { schema } from '@looks-to-me/package-database';
import { createId } from '@paralleldrive/cuid2';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getLoginUser } from './get-login-user';
import { getUserMetadata } from '../../app/_libs/auth/server/get-user-metadata';
import { database } from '../../app/_libs/database';
import { setupDatabase } from '../../app/_libs/test/setup-database';
import { setupWorker } from '../../app/_libs/test/setup-worker';

vi.mock('@supabase/auth-helpers-nextjs');
vi.mock('../../app/_libs/auth/server/get-user-metadata');

describe('get-login-user', () => {
  setupWorker();
  setupDatabase();

  describe('when not logged in', () => {
    beforeEach(() => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      vi.mocked(getUserMetadata).mockResolvedValue(undefined);
    });

    it('should return undefined', async () => {
      const result = await getLoginUser();

      expect(result).toBeUndefined();
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      vi.mocked(getUserMetadata).mockResolvedValue({
        provider: 'provider',
        sub: 'sub',
        name: 'name',
        user_name: 'email',
        avatar_url: 'avatar_url',
      });
    });

    describe('when user not found', () => {
      it('should return undefined', async () => {
        const result = await getLoginUser();

        expect(result).toBeUndefined();
      });
    });

    describe('when user found', () => {
      const userId = createId();

      beforeEach(async () => {
        await database()
          .insert(schema.users)
          .values({
            id: userId,
            registeredAt: new Date(),
          })
          .run();

        await database()
          .insert(schema.userProviders)
          .values({
            userId,
            type: 'provider',
            sub: 'sub',
          })
          .run();

        await database()
          .insert(schema.userProfiles)
          .values({
            userId,
            name: 'name',
            displayName: 'displayName',
            avatarUrl: 'avatarUrl',
          })
          .run();
      });

      it('should return user', async () => {
        const result = await getLoginUser();

        expect(result).toEqual({
          id: userId,
          profile: {
            name: 'name',
            displayName: 'displayName',
            avatarUrl: 'avatarUrl',
          },
        });
      });
    });
  });
});
