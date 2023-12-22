'use server';

import { and, desc, eq, lt, notInArray } from 'drizzle-orm';

import { getLoginUser } from '../../../../../queries/user/get-login-user';
import { findMuteUsersByUserId } from '../../../../../repositories/mute-user-repository';
import { database } from '../../../../_libs/database';
import { schema } from '../../../../_libs/database/schema';
import { Post } from '../../../_components/post';

import type { InfiniteScrollEdge } from '../../../../../components/elements/infinite-scroll';

const limit = 32;

export const fetchPosts = async (cursor?: string): Promise<InfiniteScrollEdge[]> => {
  const user = await getLoginUser();

  const muteUsers = user?.id ?
    await findMuteUsersByUserId(user.id)
    : [];
  const muteUserIds = muteUsers.map(user => user.muteUserId);

  const posts = await database()
    .select({
      id: schema.posts.id,
      word: schema.posts.word,
      postedAt: schema.posts.postedAt,
      user: {
        name: schema.userProfiles.name,
      },
    })
    .from(schema.posts)
    .innerJoin(schema.users, eq(schema.posts.userId, schema.users.id))
    .innerJoin(schema.userProfiles, eq(schema.userProfiles.userId, schema.users.id))
    .where(
      and(
        cursor ? lt(schema.posts.postedAt, new Date(cursor)) : undefined,
        muteUserIds.length
          ? notInArray(schema.posts.userId, muteUserIds)
          : undefined,
      ),
    )
    .orderBy(desc(schema.posts.postedAt))
    .limit(limit)
    .all();

  return posts.map(post => ({
    cursor: post.postedAt.toISOString(),
    node: (
      <Post
        key={post.id}
        post={{
          id: post.id,
          word: post.word,
          image: `/images/posts/${post.id}`,
          link: `/@${post.user.name}/posts/${post.id}`,
        }}
      />
    ),
  }));
};
