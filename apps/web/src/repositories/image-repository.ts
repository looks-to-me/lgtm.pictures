'use server';

import { schema } from '@looks-to-me/package-database';
import { eq, sql } from 'drizzle-orm';

import { database } from '../app/_libs/database';

export type Image = {
  id: string;
  userId: string;
  width: number;
  height: number;
};

export const saveImage = async (image: Image): Promise<Image> => {
  await database()
    .insert(schema.images)
    .values({
      id: image.id,
      userId: image.userId,
      width: image.width,
      height: image.height,
      uploadedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: schema.images.id,
      set: {
        userId: sql`excluded.user_id`,
        width: sql`excluded.width`,
        height: sql`excluded.height`,
        uploadedAt: sql`excluded.uploaded_at`,
      },
    })
    .run();

  return image;
};

export const deleteImage = async (id: Image['id']): Promise<void> => {
  await database()
    .delete(schema.images)
    .where(eq(schema.images.id, id));
};

export const findImageById = async (id: Image['id']): Promise<Image | undefined> => {
  return await database()
    .select({
      id: schema.images.id,
      userId: schema.images.userId,
      width: schema.images.width,
      height: schema.images.height,
    })
    .from(schema.images)
    .where(eq(schema.images.id, id))
    .get();
};
