import {IUserRepo} from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';

export default class UserService {

  constructor(private userRepo: IUserRepo) {}

  public async getAll(): Promise<User[]> {
    return await this.userRepo.all();
  }
}
