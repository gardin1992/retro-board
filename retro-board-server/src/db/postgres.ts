import 'reflect-metadata';
import { createConnection } from 'typeorm';

import getOrmConfig from './orm-config';

export async function getDb() {
  const connection = await createConnection(getOrmConfig());
  return connection;
}
