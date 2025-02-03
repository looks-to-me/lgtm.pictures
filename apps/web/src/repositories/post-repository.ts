'use server';

import { schema } from '@looks-to-me/package-database';
import { eq, sql } from 'drizzle-orm';

import { database } from '../app/_libs/database';

import type { User } from './user-repository';

export type Post = {
  id: string;
  userId: string;
  imageId: string;
  word: string;
};

export const savePost = async (post: Post): Promise<Post> => {
  await database()
    .insert(schema.posts)
    .values({
      id: post.id,
      userId: post.userId,
      imageId: post.imageId,
      word: post.word,
      postedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.posts.id,
      set: {
        userId: sql`excluded.user_id`,
        imageId: sql`excluded.image_id`,
        word: sql`excluded.word`,
        postedAt: sql`excluded.posted_at`,
      },
    })
    .run();

  return post;
};

export const deletePost = async (id: Post['id']): Promise<void> => {
  await database()
    .delete(schema.posts)
    .where(eq(schema.posts.id, id));
};

export const findPostById = async (id: Post['id']): Promise<Post | undefined> => {
  return database()
    .select({
      id: schema.posts.id,
      userId: schema.posts.userId,
      imageId: schema.posts.imageId,
      word: schema.posts.word,
    })
    .from(schema.posts)
    .where(eq(schema.posts.id, id))
    .get();
};

export const countPostsByUserId = async (userId: User['id']): Promise<number> => {
  const result = await database()
    .select({
      count: sql<number>`COUNT(*)`,
    }).from(schema.posts)
    .where(eq(schema.posts.userId, userId))
    .get();

  return result?.count ?? 0;
};
