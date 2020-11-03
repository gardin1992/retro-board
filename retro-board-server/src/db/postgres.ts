import 'reflect-metadata';
import { flattenDeep, uniqBy } from 'lodash';
import { createConnection, Connection, Repository } from 'typeorm';
import {
  SessionRepository,
  PostRepository,
  PostGroupRepository,
  ColumnRepository,
  VoteRepository,
  UserRepository,
  SessionTemplateRepository,
  SubscriptionRepository,
} from './repositories';
import {
  Session,
  Post,
  PostGroup,
  Vote,
  ColumnDefinition,
  SessionMetadata,
  SessionOptions,
  defaultSession,
  VoteType,
  User,
  FullUser,
  Plan,
  Currency,
} from 'retro-board-common';
import { Store } from '../types';
import getOrmConfig from './orm-config';
import shortId from 'shortid';
import { v4 } from 'uuid';
import {
  SessionTemplateEntity,
  SessionEntity,
  PostEntity,
  PostGroupEntity,
  ColumnDefinitionEntity,
  SubscriptionEntity,
  UserView,
} from './entities';
import UserEntity, { ALL_FIELDS } from './entities/User';

export async function getDb() {
  const connection = await createConnection(getOrmConfig());
  return connection;
}

const getDefaultTemplate = (userRepository: UserRepository) => async (
  id: string
): Promise<SessionTemplateEntity | null> => {
  const userWithDefaultTemplate = await userRepository.findOne(
    { id },
    { relations: ['defaultTemplate', 'defaultTemplate.columns'] }
  );
  return userWithDefaultTemplate?.defaultTemplate || null;
};

const updateOptions = (sessionRepository: SessionRepository) => async (
  session: Session,
  options: SessionOptions
): Promise<SessionOptions> => {
  return await sessionRepository.updateOptions(session, options);
};

const updateColumns = (columnRepository: ColumnRepository) => async (
  session: Session,
  columns: ColumnDefinition[]
): Promise<ColumnDefinition[]> => {
  return await columnRepository.updateColumns(session, columns);
};

export default async function db(): Promise<Store> {
  const connection = await getDb();
  const sessionRepository = connection.getCustomRepository(SessionRepository);
  const postRepository = connection.getCustomRepository(PostRepository);
  const postGroupRepository = connection.getCustomRepository(
    PostGroupRepository
  );
  const columnRepository = connection.getCustomRepository(ColumnRepository);
  const voteRepository = connection.getCustomRepository(VoteRepository);
  const userRepository = connection.getCustomRepository(UserRepository);
  const userViewRepository = connection.getRepository(UserView);
  const templateRepository = connection.getCustomRepository(
    SessionTemplateRepository
  );
  const subscriptionRepository = connection.getCustomRepository(
    SubscriptionRepository
  );
  return {
    connection,
    updateOptions: updateOptions(sessionRepository),
    updateColumns: updateColumns(columnRepository),
    getDefaultTemplate: getDefaultTemplate(userRepository),
  };
}
