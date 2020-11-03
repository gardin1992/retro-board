import {
  Session,
  Post,
  SessionOptions,
  ColumnDefinition,
  Vote,
  SessionMetadata,
  PostGroup,
  Plan,
  Currency,
} from 'retro-board-common';
import {
  SessionTemplateEntity,
  SubscriptionEntity,
  UserView,
} from './db/entities';
import UserEntity from './db/entities/User';
import { Connection } from 'typeorm';

export interface Store {
  connection: Connection;
  getDefaultTemplate: (userId: string) => Promise<SessionTemplateEntity | null>;
  updateOptions: (
    session: Session,
    options: SessionOptions
  ) => Promise<SessionOptions>;
  updateColumns: (
    session: Session,
    columns: ColumnDefinition[]
  ) => Promise<ColumnDefinition[]>;
}

export interface Configuration {
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_PORT: number;
  REDIS_ENABLED: boolean;
  REDIS_HOST: string;
  REDIS_PORT: number;
  BACKEND_PORT: number;
  SQL_LOG: boolean;
  BASE_URL: string;
  SENTRY_URL: string;
  TWITTER_KEY: string;
  TWITTER_SECRET: string;
  GOOGLE_KEY: string;
  GOOGLE_SECRET: string;
  GITHUB_KEY: string;
  GITHUB_SECRET: string;
  SENDGRID_API_KEY: string;
  SENDGRID_SENDER: string;
  STRIPE_SECRET: string;
  STRIPE_WEBHOOK_SECRET: string;
}
