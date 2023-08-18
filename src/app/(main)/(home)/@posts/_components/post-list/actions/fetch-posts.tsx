'use server';

import { desc, lt } from 'drizzle-orm';

import { db } from '../../../../../../_libs/db';
import { schema } from '../../../../../../_libs/db/schema';
import { Post } from '../../post';

import type { InfiniteScrollEdge } from '../../../../../../_components/infinite-scroll';

export const fetchPosts = async (cursor?: string): Promise<InfiniteScrollEdge[]> => {
  const posts = await db()
    .select()
    .from(schema.posts)
    .where(cursor ? lt(schema.posts.postedAt, new Date(cursor)) : undefined)
    .orderBy(desc(schema.posts.postedAt))
    .limit(32)
    .all();

  return posts.map(post => ({
    cursor: post.postedAt.toISOString(),
    node: (
      <Post
        key={post.id}
        post={{
          id: post.id,
          word: post.word,
          image: `/images/posts/${post.id}/`,
        }}
      />
    ),
  }));
};
