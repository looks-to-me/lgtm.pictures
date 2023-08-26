import { createId } from '@paralleldrive/cuid2';
import clsx from 'clsx';
import { and, eq } from 'drizzle-orm';

import * as styles from './post-create-form.css';
import { getUserMetadata } from '../../../../../_libs/auth/server/get-user-metadata';
import { db } from '../../../../../_libs/db';
import { schema } from '../../../../../_libs/db/schema';
import { env } from '../../../../../_libs/env';
import { uploadFile } from '../../../../../_libs/storage';
import { InputImageWithPreview } from '../input-image-with-preview';

import type { FC } from 'react';

class ImageUploadError extends Error {
  public override readonly name = 'ImageUploadError';

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }
}

export type PostCreateFormProps = {
  className?: string | undefined;
};

export const PostCreateForm: FC<PostCreateFormProps> = ({
  className,
}) => {

  const submitPost = async (formData: FormData): Promise<void> => {
    'use server';

    const image = formData.get('image');
    if (image === null || typeof image === 'string') {
      throw new ImageUploadError('Image is null or string');
    }

    const word = formData.get('word') || 'Good';
    if(typeof word !== 'string') {
      throw new ImageUploadError('Word is not string');
    }

    // 画像をR2にアップロードする
    const client = env().BUCKET;
    const uploadResult = await uploadFile(client)(image);

    const userMetadata = await getUserMetadata();
    if (!userMetadata) throw new ImageUploadError('Unauthorized');

    const userProvider = await db()
      .select()
      .from(schema.userProviders)
      .where(
        and(
          eq(schema.userProviders.provider, userMetadata.provider),
          eq(schema.userProviders.sub, userMetadata.sub),
        ),
      )
      .get();
    if (!userProvider) throw new ImageUploadError('Unauthorized');

    const postId = createId();

    await db().transaction(async (tx) => {
      await tx.insert(schema.images).values({
        id: uploadResult.key,
        userId: userProvider.userId,
        uploadedAt: new Date(),
      }).run();

      await tx.insert(schema.posts).values({
        id: postId,
        userId: userProvider.userId,
        imageId: uploadResult.key,
        word: word,
        postedAt: new Date(),
      }).run();
    });

    // TODO: show toast
  };

  return (
    <div className={clsx(className, styles.wrapper)}>
      <form action={submitPost} >
        <InputImageWithPreview name='image' />
        <input name='word' type="text" />
        <input type="submit" />
      </form>
    </div>
  );
};
