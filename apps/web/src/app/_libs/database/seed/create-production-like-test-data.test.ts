import { createProductionLikeUserData } from './create-production-like-test-data';
import { database } from '..';
import { setupDatabase } from '../../test/setup-database';
import { setupWorker } from '../../test/setup-worker';
import { schema } from '../schema';

type NonRelationsKeys<T extends string> = {
  [K in T]: K extends `${infer R}Relations` ? R : never;
}[T];
type TableName = NonRelationsKeys<keyof typeof schema>;

describe('insert-production-like-test-data', () => {
  setupWorker();
  setupDatabase();

  it('should at least one record exist in all tables', async () => {
    await createProductionLikeUserData();

    const tableNames = Object.keys(schema).filter(
      (tableName) => !tableName.includes('Relations'),
    ) as unknown as TableName[];

    for (const tableName of tableNames) {
      const result = await database().select().from(schema[tableName]).all();
      expect(result.length).toBeGreaterThanOrEqual(1);
    }
  });
});
