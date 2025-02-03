import { schema } from '@looks-to-me/package-database';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { deleteMuteUser, findMuteUserByUserIdAndMuteUserId, saveMuteUser } from './mute-user-repository';
import { database } from '../app/_libs/database';
import { setupDatabase } from '../app/_libs/test/setup-database';
import { setupWorker } from '../app/_libs/test/setup-worker';

import type { MuteUser } from './mute-user-repository';

describe('mute-user-repository', () => {
  setupWorker();
  setupDatabase();

  const userId1 = createId();
  const userId2 = createId();

  const muteUser: MuteUser = {
    userId: userId1,
    muteUserId: userId2,
  };
  beforeEach(async () => {
    await database()
      .insert(schema.users)
      .values([{
        id: userId1,
        registeredAt: new Date(),
      },
      {
        id: userId2,
        registeredAt: new Date(),
      }])
      .run();
  });

  describe('saveMuteUser', () => {
    describe('create', () => {
      it('should create muteUser', async () => {
        await saveMuteUser(muteUser);

        const result = await database()
          .select()
          .from(schema.muteUsers)
          .where(eq(schema.muteUsers.userId, userId1))
          .get();

        expect(result).toEqual({
          ...muteUser,
        });
      });

      it('should return muteUser', async () => {
        const result = await saveMuteUser(muteUser);

        expect(result).toEqual(muteUser);
      });

      it('should throw error if user does not exist', async () => {
        const invalidMuteUser: MuteUser = {
          ...muteUser,
          userId: createId(),
        };

        await expect(saveMuteUser(invalidMuteUser)).rejects.toThrow();
      });
    });

    describe('update', () => {
      const otherUserId = createId();

      beforeEach(async () => {
        await saveMuteUser(muteUser);

        await database()
          .insert(schema.users)
          .values({
            id: otherUserId,
            registeredAt: new Date(),
          })
          .run();
      });

      it('should update muteUser', async () => {
        const updatedMuteUser: MuteUser = {
          ...muteUser,
          userId: otherUserId,
        };

        await saveMuteUser(updatedMuteUser);

        const result = await database()
          .select()
          .from(schema.muteUsers)
          .where(eq(schema.muteUsers.userId, otherUserId))
          .get();

        expect(result).toEqual(
          updatedMuteUser,
        );
      });

      it('should return updated muteUser', async () => {
        const updatedMuteUser: MuteUser = {
          ...muteUser,
          userId: otherUserId,
        };
        const result = await saveMuteUser(updatedMuteUser);

        expect(result).toEqual(updatedMuteUser);
      });

      it('should throw error if user does not exist', async () => {
        const invalidMuteUser: MuteUser = {
          ...muteUser,
          userId: createId(),
        };

        await expect(saveMuteUser(invalidMuteUser)).rejects.toThrow();
      });
    });
  });

  describe('deleteMuteUser', () => {
    it('should delete muteUser', async () => {
      await saveMuteUser(muteUser);

      await deleteMuteUser(muteUser);

      const result = await database()
        .select()
        .from(schema.muteUsers)
        .where(eq(schema.muteUsers.userId, muteUser.userId))
        .get();

      expect(result).toBeUndefined();
    });

    it('should not throw error if muteUser does not exist', async () => {
      await expect(deleteMuteUser(muteUser)).resolves.not.toThrow();
    });
  });

  describe('findMuteUserByUserIdAndMuteUserId', () => {
    it('should find muteUser by id', async () => {
      await saveMuteUser(muteUser);

      const result = await findMuteUserByUserIdAndMuteUserId(muteUser.userId, muteUser.muteUserId);

      expect(result).toEqual(muteUser);
    });

    it('should return undefined if muteUser not found', async () => {
      const result = await findMuteUserByUserIdAndMuteUserId(muteUser.userId, muteUser.muteUserId);

      expect(result).toBeUndefined();
    });
  });
});
