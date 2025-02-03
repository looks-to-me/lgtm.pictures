import { schema } from '@looks-to-me/package-database';
import { createId } from '@paralleldrive/cuid2';
import { eq } from 'drizzle-orm';
import { beforeEach, describe, expect, it } from 'vitest';

import { deleteImage, findImageById, saveImage } from './image-repository';
import { database } from '../app/_libs/database';
import { setupDatabase } from '../app/_libs/test/setup-database';
import { setupWorker } from '../app/_libs/test/setup-worker';

import type { Image } from './image-repository';

describe('image-repository', () => {
  setupWorker();
  setupDatabase();

  const userId = createId();

  const image: Image = {
    id: createId(),
    userId: userId,
    width: 100,
    height: 100,
  };

  beforeEach(async () => {
    await database()
      .insert(schema.users)
      .values({
        id: userId,
        registeredAt: new Date(),
      })
      .run();
  });

  describe('saveImage', () => {
    describe('create', () => {
      it('should create image', async () => {
        await saveImage(image);

        const result = await database()
          .select()
          .from(schema.images)
          .where(eq(schema.images.id, image.id))
          .get();

        expect(result).toEqual({
          ...image,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          uploadedAt: expect.any(Date),
        });
      });

      it('should return created image', async () => {
        const result = await saveImage(image);

        expect(result).toEqual(image);
      });

      it('should throw error if user does not exist', async () => {
        const invalidImage: Image = {
          ...image,
          userId: createId(),
        };

        await expect(saveImage(invalidImage)).rejects.toThrow();
      });
    });

    describe('update', () => {
      const otherUserId = createId();

      beforeEach(async () => {
        await saveImage(image);

        await database()
          .insert(schema.users)
          .values({
            id: otherUserId,
            registeredAt: new Date(),
          })
          .run();
      });

      it('should update image', async () => {
        const updatedImage: Image = {
          ...image,
          userId: otherUserId,
          width: 200,
          height: 200,
        };

        await saveImage(updatedImage);

        const result = await database()
          .select()
          .from(schema.images)
          .where(eq(schema.images.id, updatedImage.id))
          .get();

        expect(result).toEqual({
          ...updatedImage,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          uploadedAt: expect.any(Date),
        });
      });

      it('should return updated image', async () => {
        const updatedImage: Image = {
          ...image,
          userId: otherUserId,
          width: 200,
          height: 200,
        };

        const result = await saveImage(updatedImage);

        expect(result).toEqual(updatedImage);
      });

      it('should throw error if user does not exist', async () => {
        const invalidImage: Image = {
          ...image,
          userId: createId(),
        };

        await expect(saveImage(invalidImage)).rejects.toThrow();
      });
    });
  });

  describe('deleteImage', () => {
    it('should delete image', async () => {
      await saveImage(image);

      await deleteImage(image.id);

      const result = await database()
        .select()
        .from(schema.images)
        .where(eq(schema.images.id, image.id))
        .get();

      expect(result).toBeUndefined();
    });

    it('should not throw error if image does not exist', async () => {
      await expect(deleteImage(image.id)).resolves.not.toThrow();
    });
  });

  describe('findImageById', () => {
    it('should find image by id', async () => {
      await saveImage(image);

      const result = await findImageById(image.id);

      expect(result).toEqual(image);
    });

    it('should return undefined if image not found', async () => {
      const result = await findImageById(image.id);

      expect(result).toBeUndefined();
    });
  });
});
