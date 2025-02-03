import sqlite3InitModule from '@sqlite.org/sqlite-wasm';
import { drizzle as drizzleProxy } from 'drizzle-orm/sqlite-proxy';

import * as schema from './schema';

import type { Database } from './index';

export const databaseOfWasm = async (): Promise<Database> => {
  const sqlite3 = await sqlite3InitModule({
    print: console.log,
    printErr: console.error,
  });

  const sqlite = new sqlite3.oo1.JsStorageDb('local');
  return drizzleProxy(async (sql, parameters) => {
    return await new Promise((resolve) => {
      try {
        const rows = sqlite.exec({
          sql,
          bind: parameters,
          rowMode: 'object',
          returnValue: 'resultRows',
        });
        resolve({ rows });
      } catch (error) {
        console.error(error);
        resolve({ rows: [] });
      }
    });
  }, { schema });
};
