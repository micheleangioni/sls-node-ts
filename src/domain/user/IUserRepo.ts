import User from '../../domain/user/user';
import { UserCreateData, UserUpdateData } from './declarations';

export interface IUserRepo {
  all (): Promise<User[]>;
  findById (userId: string): Promise<User|null>;
  findByEmail (email: string): Promise<User|null>;
  findByUsername (email: string): Promise<User|null>;
  count (): Promise<number>;
  create (data: UserCreateData ): Promise<User>;
  updateUser (userId: string, data: UserUpdateData): Promise<User>;
}
