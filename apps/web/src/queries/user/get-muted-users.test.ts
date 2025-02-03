import { schema } from '@looks-to-me/package-database';
import { createId } from '@paralleldrive/cuid2';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getLoginUser } from './get-login-user';
import { getMutedUsers } from './get-muted-users';
import { database } from '../../app/_libs/database';
import { setupDatabase } from '../../app/_libs/test/setup-database';
import { setupWorker } from '../../app/_libs/test/setup-worker';

vi.mock('@supabase/auth-helpers-nextjs');
vi.mock('next/navigation', () => ({
  redirect: vi.fn(() => {
    throw new Error('redirect');
  }),
}));
vi.mock('./get-login-user');

describe('get-muted-users', () => {
  setupWorker();
  setupDatabase();

  describe('when not logged in', () => {
    beforeEach(() => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      vi.mocked(getLoginUser).mockResolvedValue(undefined);
    });

    it('should throw error', async () => {
      await expect(getMutedUsers()).rejects.toThrow();
    });
  });

  describe('when logged in', () => {
    const userId1 = createId();
    const userId2 = createId();

    beforeEach(async () => {
      await database()
        .insert(schema.users)
        .values([{
          id: userId1,
          registeredAt: new Date(),
        }, {
          id: userId2,
          registeredAt: new Date(),
        }])
        .run();

      await database()
        .insert(schema.userProfiles)
        .values([{
          userId: userId1,
          name: 'name1',
          displayName: 'displayName1',
          avatarUrl: 'avatarUrl1',
        }, {
          userId: userId2,
          name: 'name2',
          displayName: 'displayName2',
          avatarUrl: 'avatarUrl2',
        }])
        .run();
      vi.mocked(getLoginUser).mockResolvedValue({
        id: userId1,
        profile: {
          name: 'name1',
          displayName: 'displayName1',
          avatarUrl: 'avatarUrl1',
        },
      });
    });

    describe('when user1 is not muted', () => {
      it('should return empty array', async () => {
        const result = await getMutedUsers();
        expect(result).toEqual([]);
      });
    });

    describe('when user1 mutes user2', () => {
      beforeEach(async () => {
        await database()
          .insert(schema.muteUsers)
          .values({
            userId: userId1,
            muteUserId: userId2,
          })
          .run();
      });

      it('should return return array containing user2\'s profile', async () => {
        const result = await getMutedUsers();
        expect(result).toEqual([
          {
            id: userId2,
            profile: {
              name: 'name2',
              displayName: 'displayName2',
            },
          },
        ]);
      });
    });
  });
});
