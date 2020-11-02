import {
  UserEntity,
  PostEntity,
  PostGroupEntity,
  ColumnDefinitionEntity,
} from '../entities';
import {
  Session,
  defaultSession,
  ColumnDefinition,
  SessionOptions,
} from 'retro-board-common';
import shortId from 'shortid';
import { v4 } from 'uuid';
import { Connection } from 'typeorm';
import {
  UserRepository,
  SessionRepository,
  SessionTemplateRepository,
  PostRepository,
  PostGroupRepository,
  ColumnRepository,
} from '../repositories';

export async function createSession(
  connection: Connection,
  author: UserEntity
): Promise<Session> {
  const userRepository = connection.getCustomRepository(UserRepository);
  const sessionRepository = connection.getCustomRepository(SessionRepository);
  try {
    const id = shortId();
    const userWithDefaultTemplate = await userRepository.findOne(
      { id: author.id },
      { relations: ['defaultTemplate', 'defaultTemplate.columns'] }
    );
    if (userWithDefaultTemplate?.defaultTemplate) {
      const template = userWithDefaultTemplate.defaultTemplate;
      const newSession = await sessionRepository.saveFromJson(
        {
          ...defaultSession,
          id,
          options: { ...template.options },
          columns: template.columns!.map(
            (c) =>
              ({
                ...c,
                id: v4(),
                author: { id: author.id },
              } as ColumnDefinition)
          ),
        },
        author.id
      );
      return newSession;
    } else {
      const newSession = await sessionRepository.saveFromJson(
        {
          ...defaultSession,
          columns: defaultSession.columns.map((c) => ({
            ...c,
            id: v4(),
          })),
          id,
        },
        author.id
      );
      return newSession;
    }
  } catch (err) {
    throw err;
  }
}

export async function createCustom(
  connection: Connection,
  options: SessionOptions,
  columns: ColumnDefinition[],
  setDefault: boolean,
  author: UserEntity
): Promise<Session> {
  const userRepository = connection.getCustomRepository(UserRepository);
  const sessionRepository = connection.getCustomRepository(SessionRepository);
  const templateRepository = connection.getCustomRepository(
    SessionTemplateRepository
  );
  try {
    const id = shortId();
    const session = await sessionRepository.findOne({ id });
    if (!session) {
      const newSession = await sessionRepository.saveFromJson(
        {
          ...defaultSession,
          id,
          options,
          columns,
        },
        author.id
      );

      if (setDefault) {
        const defaultTemplate = await templateRepository.saveFromJson(
          'Default Template',
          columns,
          options,
          author.id
        );
        await userRepository.persistTemplate(author.id, defaultTemplate.id);
      }

      return newSession;
    }
  } catch (err) {
    throw err;
  }
  throw Error('The session already exists');
}

export async function getSession(
  connection: Connection,
  sessionId: string
): Promise<Session | null> {
  const postRepository = connection.getCustomRepository(PostRepository);
  const postGroupRepository = connection.getCustomRepository(
    PostGroupRepository
  );
  const sessionRepository = connection.getCustomRepository(SessionRepository);
  const columnRepository = connection.getCustomRepository(ColumnRepository);

  try {
    const session = await sessionRepository.findOne({ id: sessionId });
    if (session) {
      const posts = (await postRepository.find({
        where: { session },
        order: { created: 'ASC' },
      })) as PostEntity[];
      const groups = (await postGroupRepository.find({
        where: { session },
        order: { created: 'ASC' },
      })) as PostGroupEntity[];
      const columns = (await columnRepository.find({
        where: { session },
        order: { index: 'ASC' },
      })) as ColumnDefinitionEntity[];
      return {
        ...session.toJson(),
        columns: columns.map((c) => c.toJson()),
        posts: posts.map((p) => p.toJson()),
        groups: groups.map((g) => g.toJson()),
      };
    } else {
      return null;
    }
  } catch (err) {
    throw err;
  }
}
