import { schema } from '@looks-to-me/package-database';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { countPostsByUserId, deletePost, findPostById, savePost } from './post-repository';
import { database } from '../app/_libs/database';
import { setupDatabase } from '../app/_libs/test/setup-database';
import { setupWorker } from '../app/_libs/test/setup-worker';

import type { Post } from './post-repository';

describe('post-repository', () => {
  setupWorker();
  setupDatabase();

  const userId = createId();

  const imageId = createId();

  const post: Post = {
    id: createId(),
    userId: userId,
    imageId: imageId,
    word: 'word',
  };

  beforeEach(async () => {
    await database()
      .insert(schema.users)
      .values({
        id: userId,
        registeredAt: new Date(),
      })
      .run();

    await database()
      .insert(schema.images)
      .values({
        id: imageId,
        userId: userId,
        width: 100,
        height: 100,
        uploadedAt: new Date(),
      })
      .run();
  });

  describe('savePost', () => {
    describe('create', () => {
      it('should create post', async () => {
        await savePost(post);

        const result = await database()
          .select()
          .from(schema.posts)
          .where(eq(schema.posts.id, post.id))
          .get();

        expect(result).toEqual({
          ...post,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          postedAt: expect.any(Date),
        });
      });

      it('should return created post', async () => {
        const result = await savePost(post);

        expect(result).toEqual(post);
      });

      it('should throw error if user does not exist', async () => {
        const invalidPost: Post = {
          ...post,
          userId: createId(),
        };

        await expect(savePost(invalidPost)).rejects.toThrow();
      });

      it('should throw error if image does not exist', async () => {
        const invalidPost: Post = {
          ...post,
          imageId: createId(),
        };

        await expect(savePost(invalidPost)).rejects.toThrow();
      });
    });

    describe('update', () => {
      const otherUserId = createId();
      const otherImageId = createId();

      beforeEach(async () => {
        await savePost(post);

        await database()
          .insert(schema.users)
          .values({
            id: otherUserId,
            registeredAt: new Date(),
          })
          .run();

        await database()
          .insert(schema.images)
          .values({
            id: otherImageId,
            userId: otherUserId,
            width: 100,
            height: 100,
            uploadedAt: new Date(),
          })
          .run();
      });

      it('should update post', async () => {
        const updatedPost: Post = {
          ...post,
          userId: otherUserId,
          imageId: otherImageId,
          word: 'updated',
        };

        await savePost(updatedPost);

        const result = await database()
          .select()
          .from(schema.posts)
          .where(eq(schema.posts.id, post.id))
          .get();

        expect(result).toEqual({
          ...updatedPost,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          postedAt: expect.any(Date),
        });
      });

      it('should return updated post', async () => {
        const updatedPost: Post = {
          ...post,
          userId: otherUserId,
          imageId: otherImageId,
          word: 'updated',
        };

        const result = await savePost(updatedPost);

        expect(result).toEqual(updatedPost);
      });

      it('should throw error if user does not exist', async () => {
        const invalidPost: Post = {
          ...post,
          userId: createId(),
        };

        await expect(savePost(invalidPost)).rejects.toThrow();
      });

      it('should throw error if image does not exist', async () => {
        const invalidPost: Post = {
          ...post,
          imageId: createId(),
        };

        await expect(savePost(invalidPost)).rejects.toThrow();
      });
    });
  });

  describe('deletePost', () => {
    it('should delete post', async () => {
      await savePost(post);

      await deletePost(post.id);

      const result = await database()
        .select()
        .from(schema.posts)
        .where(eq(schema.posts.id, post.id))
        .get();

      expect(result).toBeUndefined();
    });

    it('should not throw error if image does not exist', async () => {
      await expect(deletePost(post.id)).resolves.not.toThrow();
    });
  });

  describe('findPostById', () => {
    it('should find post by id', async () => {
      await savePost(post);

      const result = await findPostById(post.id);

      expect(result).toEqual(post);
    });

    it('should return undefined if post does not exist', async () => {
      const result = await findPostById(post.id);

      expect(result).toBeUndefined();
    });
  });

  describe('countPostsByUserId', () => {
    it('should count posts by user id', async () => {
      await savePost(post);

      const result = await countPostsByUserId(userId);

      expect(result).toBe(1);
    });

    it('should return 0 if post does not exist', async () => {
      const result = await countPostsByUserId(createId());

      expect(result).toBe(0);
    });
  });
});
