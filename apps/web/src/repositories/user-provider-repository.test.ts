import { schema } from '@looks-to-me/package-database';
import { createId } from '@paralleldrive/cuid2';
import { and, eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { findUserProviderByTypeAndSub, saveUserProvider } from './user-provider-repository';
import { database } from '../app/_libs/database';
import { setupDatabase } from '../app/_libs/test/setup-database';
import { setupWorker } from '../app/_libs/test/setup-worker';

import type { UserProvider } from './user-provider-repository';

describe('user-provider-repository', () => {
  setupWorker();
  setupDatabase();

  const userId = createId();

  const userProvider: UserProvider = {
    userId: userId,
    type: 'github',
    sub: 'subject',
  };

  beforeEach(async () => {
    await database()
      .insert(schema.users)
      .values({
        id: userId,
        registeredAt: new Date(),
      })
      .run();
  });

  describe('saveUserProvider', () => {
    describe('create', () => {
      it('should create user provider', async () => {
        await saveUserProvider(userProvider);

        const result = await database()
          .select()
          .from(schema.userProviders)
          .where(
            and(
              eq(schema.userProviders.type, userProvider.type),
              eq(schema.userProviders.sub, userProvider.sub),
            ),
          )
          .get();

        expect(result).toEqual({
          ...userProvider,
        });
      });

      it('should return created user provider', async () => {
        const result = await saveUserProvider(userProvider);

        expect(result).toEqual(userProvider);
      });

      it('should throw error if user does not exist', async () => {
        const invalidUserProvider: UserProvider = {
          ...userProvider,
          userId: createId(),
        };

        await expect(saveUserProvider(invalidUserProvider)).rejects.toThrow();
      });
    });

    describe('update', () => {
      beforeEach(async () => {
        await saveUserProvider(userProvider);
      });

      it('should update user provider', async () => {
        const updatedUserProvider: UserProvider = {
          ...userProvider,
          sub: 'updated-sub',
          type: 'updated-type',
        };

        await saveUserProvider(updatedUserProvider);

        const result = await database()
          .select()
          .from(schema.userProviders)
          .where(
            and(
              eq(schema.userProviders.type, updatedUserProvider.type),
              eq(schema.userProviders.sub, updatedUserProvider.sub),
            ),
          )
          .get();

        expect(result).toEqual(updatedUserProvider);
      });

      it('should return updated user provider', async () => {
        const updatedUserProvider: UserProvider = {
          ...userProvider,
          sub: 'updated-sub',
          type: 'updated-type',
        };

        const result = await saveUserProvider(updatedUserProvider);

        expect(result).toEqual(updatedUserProvider);
      });

      it('should throw error if user does not exist', async () => {
        const invalidUserProvider: UserProvider = {
          ...userProvider,
          userId: createId(),
        };

        await expect(saveUserProvider(invalidUserProvider)).rejects.toThrow();
      });
    });
  });

  describe('findUserProviderByTypeAndSub', () => {
    it('should find user provider by type and sub', async () => {
      await saveUserProvider(userProvider);

      const result = await findUserProviderByTypeAndSub(userProvider.type, userProvider.sub);

      expect(result).toEqual(userProvider);
    });

    it('should return undefined if user provider does not exist', async () => {
      const result = await findUserProviderByTypeAndSub(userProvider.type, userProvider.sub);

      expect(result).toBeUndefined();
    });
  });
});
