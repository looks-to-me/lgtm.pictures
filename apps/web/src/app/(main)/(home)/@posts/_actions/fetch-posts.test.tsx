import { schema } from '@looks-to-me/package-database';
import { createId } from '@paralleldrive/cuid2';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fetchPosts } from './fetch-posts';
import { getLoginUser } from '../../../../../queries/user/get-login-user';
import { database } from '../../../../_libs/database';
import { setupDatabase } from '../../../../_libs/test/setup-database';
import { setupWorker } from '../../../../_libs/test/setup-worker';

import type { PostProps } from '../../../_components/post';
import type { ReactElement } from 'react';

vi.mock('@supabase/auth-helpers-nextjs');
vi.mock('../../../../../queries/user/get-login-user');

describe('fetchPosts', () => {
  setupWorker();
  setupDatabase();

  describe('when post not found', () => {
    it('should return empty array', async () => {
      const posts = await fetchPosts();

      expect(posts).toHaveLength(0);
    });
  });

  describe('when post found', () => {
    const userId1 = createId();
    const userId2 = createId();

    const postId1 = createId();
    const postId2 = createId();

    beforeEach(async () => {
      const user1 = await database()
        .insert(schema.users)
        .values({
          id: userId1,
          registeredAt: new Date(),
        })
        .returning()
        .get();

      const userProfile1 = await database()
        .insert(schema.userProfiles)
        .values({
          userId: user1.id,
          name: 'name',
          displayName: 'displayName',
          avatarUrl: 'avatarUrl',
        })
        .returning()
        .get();

      const image1 = await database()
        .insert(schema.images)
        .values({
          id: createId(),
          userId: user1.id,
          width: 100,
          height: 100,
          uploadedAt: new Date(),
        })
        .returning()
        .get();

      await database()
        .insert(schema.posts)
        .values({
          id: postId1,
          userId: user1.id,
          imageId: image1.id,
          word: 'word',
          postedAt: new Date(),
        });

      const user2 = await database()
        .insert(schema.users)
        .values({
          id: userId2,
          registeredAt: new Date(),
        })
        .returning()
        .get();

      await database()
        .insert(schema.userProfiles)
        .values({
          userId: user2.id,
          name: 'name',
          displayName: 'displayName',
          avatarUrl: 'avatarUrl',
        })
        .returning()
        .get();

      const image2 = await database()
        .insert(schema.images)
        .values({
          id: createId(),
          userId: user2.id,
          width: 100,
          height: 100,
          uploadedAt: new Date(),
        })
        .returning()
        .get();

      await database()
        .insert(schema.posts)
        .values({
          id: postId2,
          userId: user2.id,
          imageId: image2.id,
          word: 'word',
          postedAt: new Date(),
        });

      vi.mocked(getLoginUser).mockResolvedValue({
        ...user1,
        profile: userProfile1,
      });
    });

    it('should return posts', async () => {
      const posts = await fetchPosts();

      expect(posts).toHaveLength(2);
    });

    it('should return posts in the order of latest', async () => {
      const posts = await fetchPosts();

      const elements = posts.map((post) => post.node as ReactElement<PostProps>);
      expect(elements[0]?.props.post.id).toBe(postId2);
      expect(elements[1]?.props.post.id).toBe(postId1);
    });

    describe('when user muted', () => {
      beforeEach(async () => {
        await database()
          .insert(schema.muteUsers)
          .values({
            userId: userId1,
            muteUserId: userId2,
          });
      });

      it('should return post once', async () => {
        const posts = await fetchPosts();

        expect(posts).toHaveLength(1);
      });

      it('should not return user2 post', async () => {
        const posts = await fetchPosts();

        const elements = posts.map((post) => post.node as ReactElement<PostProps>);
        expect(elements[0]?.props.post.id).toBe(postId1);
      });
    });
  });
});
