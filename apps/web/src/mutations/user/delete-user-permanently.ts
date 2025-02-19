'use server';

import { deleteImageCache } from '@looks-to-me/package-image-cache';
import { eq, inArray, or } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

import { database } from '../../app/_libs/database';
import { schema } from '../../app/_libs/database/schema';
import { privateEnv } from '../../app/_libs/env';
import { getLoginUser } from '../../queries/user/get-login-user';

export type DeleteUserPermanentlyResult =
  | {
    type: 'success';
    message: `Your account(@${string}) has been successfully deleted.`;
  }
  | {
    type: 'error';
    reason: 'databaseError' | 'unauthorized';
    message: string;
  };

export const deleteUserPermanently =
  async (): Promise<DeleteUserPermanentlyResult> => {
    const user = await getLoginUser();
    if (!user) return { type: 'error', reason: 'unauthorized', message: 'Login required!' };

    const posts = await database()
      .select({ id: schema.posts.id })
      .from(schema.posts)
      .where(eq(schema.posts.userId, user.id))
      .all();
    const postIds = posts.map((post) => post.id);

    // TODO: Make use of transaction or batch.
    // @see: https://github.com/drizzle-team/drizzle-orm/issues/758
    await database()
      .delete(schema.postTags)
      .where(inArray(schema.postTags.postId, postIds));

    await database()
      .delete(schema.posts)
      .where(eq(schema.posts.userId, user.id));

    await database().delete(schema.images).where(eq(schema.images.userId, user.id)),

    await database()
      .delete(schema.muteUsers)
      .where(
        or(
          eq(schema.muteUsers.userId, user.id),
          eq(schema.muteUsers.muteUserId, user.id),
        ),
      ),

    await database()
      .delete(schema.userProfiles)
      .where(eq(schema.userProfiles.userId, user.id)),

    await database()
      .delete(schema.userProviders)
      .where(eq(schema.userProviders.userId, user.id)),

    await database().delete(schema.users).where(eq(schema.users.id, user.id));

    for (const postId of postIds) {
      void deleteImageCache({
        bucket: privateEnv().BUCKET,
        path: `images/posts/${postId}`,
      });
    }

    revalidatePath('/');
    revalidatePath('/shuffle');
    revalidatePath(`/@${user.profile.name}`);
    
    return {
      type: 'success',
      message: `Your account(@${user.profile.name}) has been successfully deleted.`,
    };
  };
