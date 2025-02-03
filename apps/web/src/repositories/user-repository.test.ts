import { schema } from '@looks-to-me/package-database';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { findUserById, findUserByName, saveUser } from './user-repository';
import { database } from '../app/_libs/database';
import { setupDatabase } from '../app/_libs/test/setup-database';
import { setupWorker } from '../app/_libs/test/setup-worker';

import type { User } from './user-repository';

describe('user-repository', () => {
  setupWorker();
  setupDatabase();

  const user: User = {
    id: createId(),
    profile: {
      name: 'name',
      displayName: 'display-name',
      avatarUrl: 'avatar-url',
    },
  };

  describe('saveUser', () => {
    describe('create', () => {
      it('should create user', async () => {
        await saveUser(user);

        const result = await database()
          .select()
          .from(schema.users)
          .where(eq(schema.users.id, user.id))
          .get();

        expect(result).toEqual({
          id: user.id,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          registeredAt: expect.any(Date),
        });
      });

      it('should return created user', async () => {
        const result = await saveUser(user);

        expect(result).toEqual(user);
      });
    });

    describe('update', () => {
      beforeEach(async () => {
        await saveUser(user);
      });

      it('should update user', async () => {
        const updatedUser: User = {
          ...user,
          profile: {
            ...user.profile,
            name: 'updated-name',
            displayName: 'updated-display-name',
            avatarUrl: 'updated-avatar-url',
          },
        };

        await saveUser(updatedUser);

        const result = await database()
          .select({
            id: schema.users.id,
            profile: {
              name: schema.userProfiles.name,
              displayName: schema.userProfiles.displayName,
              avatarUrl: schema.userProfiles.avatarUrl,
            },
            registeredAt: schema.users.registeredAt,
          })
          .from(schema.users)
          .innerJoin(schema.userProfiles, eq(schema.users.id, schema.userProfiles.userId))
          .where(eq(schema.userProfiles.userId, user.id))
          .get();

        expect(result).toEqual({
          ...updatedUser,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          registeredAt: expect.any(Date),
        });
      });

      it('should return updated user', async () => {
        const updatedUser: User = {
          ...user,
          profile: {
            ...user.profile,
            name: 'updated-name',
            displayName: 'updated-display-name',
            avatarUrl: 'updated-avatar-url',
          },
        };

        const result = await saveUser(updatedUser);

        expect(result).toEqual(updatedUser);
      });
    });
  });

  describe('findUserById', () => {
    it('should find user by id', async () => {
      await saveUser(user);

      const result = await findUserById(user.id);

      expect(result).toEqual(user);
    });

    it('should return undefined if user does not exist', async () => {
      const result = await findUserById(user.id);

      expect(result).toBeUndefined();
    });
  });

  describe('findUserByName', () => {
    it('should find user by name', async () => {
      await saveUser(user);

      const result = await findUserByName(user.profile.name);

      expect(result).toEqual(user);
    });

    it('should return undefined if user does not exist', async () => {
      const result = await findUserByName(user.profile.name);

      expect(result).toBeUndefined();
    });
  });
});
