import { databaseOfD1 } from '@looks-to-me/package-database';

import { privateEnv } from '../../env';

import type { Database } from '@looks-to-me/package-database';

let instance: Database | undefined;

export const initDatabase = (value: Database): void => {
  if (instance) return;
  instance = value;
};

export const database = (): Database => {
  if (instance) return instance;
  const database = databaseOfD1(privateEnv().DB);
  initDatabase(database);
  return database;
};
