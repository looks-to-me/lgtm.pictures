import { drizzle as drizzleD1 } from 'drizzle-orm/d1';

import * as schema from './schema';

import type { AnyD1Database } from 'drizzle-orm/d1';
import type { BaseSQLiteDatabase } from 'drizzle-orm/sqlite-core';

export * from './schema';

export type DatabaseSchema = typeof schema;

export type Database = BaseSQLiteDatabase<'async', unknown, DatabaseSchema>;

export const databaseOfD1 = (client: AnyD1Database): Database => {
  return drizzleD1(client, { schema });
};
