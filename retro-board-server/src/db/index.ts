import chalk from 'chalk';
import { Connection } from 'typeorm';
import { getDb } from './postgres';

export default (): Promise<Connection> => {
  console.log(chalk`{yellow 💻  Using {red Postgres} database}`);
  return getDb();
};
