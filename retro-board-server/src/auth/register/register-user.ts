import { RegisterPayload, User } from "retro-board-common";
import { Store } from "../../types";
import { v4 } from "uuid";
import { hashPassword } from "../../utils";


export default async function registerUser(store: Store, details: RegisterPayload): Promise<User | null> {
  const existingUser = await store.getUserByUsername(details.username);
  if (existingUser) {
    return null;
  }
  const hashedPassword = await hashPassword(details.password);
  const newUser: User = {
    accountType: 'password',
    id: v4(),
    name: details.name,
    photo: null,
    language: 'en',
    username: details.username,
    password: hashedPassword,
    emailVerification: v4(),
  };
  const persistedUser = await store.getOrSaveUser(newUser);
  return persistedUser;
}