import User from '../../domain/user/user';

export interface IUserRepo {
  all (): Promise<User[]>;
  findById (userId: string): Promise<User | null>;
  findByEmail (email: string): Promise<User | null>;
  findByUsername (email: string): Promise<User | null>;
  count (): Promise<number>;
  create (user: User): Promise<User>;
  updateUser (user: User): Promise<User>;
}
