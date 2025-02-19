import { createRequire } from 'node:module';
import path from 'node:path';

import { schema } from '@looks-to-me/package-database';
import { sql } from 'drizzle-orm';
import { readMigrationFiles } from 'drizzle-orm/migrator';

import type { Database } from '@looks-to-me/package-database';

export const migrate = async (database: Database) => {
  const require = createRequire(import.meta.url);
  const migrations = readMigrationFiles({
    migrationsFolder: path.join(require.resolve('@looks-to-me/package-database'), '../../migrations'),
  });

  for (const migration of migrations) {
    for (const query of migration.sql) {
      await database.run(sql.raw(query));
    }
  }
};

export const truncate = async (database: Database) => {
  await database.delete(schema.postTags);
  await database.delete(schema.posts);
  await database.delete(schema.images);
  await database.delete(schema.tags);
  await database.delete(schema.muteUsers);
  await database.delete(schema.userProfiles);
  await database.delete(schema.userProviders);
  await database.delete(schema.users);
};
