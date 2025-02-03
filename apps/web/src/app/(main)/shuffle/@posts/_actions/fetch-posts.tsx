'use server';

import { schema } from '@looks-to-me/package-database';
import { and, eq, isNull, ne, or, sql } from 'drizzle-orm';

import { getLoginUser } from '../../../../../queries/user/get-login-user';
import { database } from '../../../../_libs/database';
import { Post } from '../../../_components/post';

import type { InfiniteScrollEdge } from '../../../../../components/elements/infinite-scroll';

// Fisher–Yates shuffle
const shuffle = <T extends object>(array: Array<T>): Array<T> => {
  return array.reduce((previous, current, index) => {
    const key = Math.floor(Math.random() * (index + 1));
    previous[index] = previous[key]!;
    previous[key] = current;
    return previous;
  }, [] as Array<T>);
};

const limit = 32;

export const fetchPosts = async (): Promise<InfiniteScrollEdge[]> => {
  const user = await getLoginUser();

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
    .leftJoin(schema.muteUsers, eq(schema.muteUsers.muteUserId, schema.users.id))
    .where(
      and(
        or(
          isNull(schema.muteUsers.userId),
          ne(schema.muteUsers.userId, user?.id ?? ''),
        ),
        sql`posts._ROWID_ >= (ABS(RANDOM()) % ((SELECT MAX(_ROWID_) FROM posts)))`,
      ),
    )
    .limit(limit)
    .all();

  return shuffle(posts).map((post) => ({
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
