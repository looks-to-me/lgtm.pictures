import { databaseOfWasm } from '@looks-to-me/package-database/wasm';
import { sql } from 'drizzle-orm';
import * as v from 'valibot';

import { initDatabase } from './index';

const getJournal = async () => {
  const result = await fetch('./meta/_journal.json').then((result) => result.text());
  return v.parse(v.object({
    entries: v.array(v.object({
      tag: v.string(),
    })),
  }), JSON.parse(result));
};

const getQuery = async (tag: string) => {
  return await fetch(`./${tag}.sql`).then((result) => result.text());
};

export const initMockDatabase = async () => {
  const database = await databaseOfWasm();
  initDatabase(database);

  const tables = await database.all<{ name: string }>(sql.raw('SELECT name FROM sqlite_master WHERE type=\'table\';'));
  for (const table of tables ?? []) {
    await database.run(sql.raw(`DROP TABLE ${table.name};`));
  }

  const journal = await getJournal();
  for (const entry of journal.entries) {
    const query = await getQuery(entry.tag);
    await database.run(sql.raw(query));
  }
};
