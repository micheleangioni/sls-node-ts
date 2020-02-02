import {AbstractApplicationService} from '../AbstractApplicationService';
import EventPublisher from '../eventPublisher';
import {UserCreateData} from './declarations';
import {IUserRepo} from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';

export default class UserService extends AbstractApplicationService {
  constructor(private userRepo: IUserRepo, eventPublisher: EventPublisher) {
    super(eventPublisher);
  }

  /**
   * Fetch and return all users.
   *
   * @return Promise<User[]>
   */
  public async getAll(): Promise<User[]> {
    return await this.userRepo.all();
  }

  /**
   * Create, persist and return a new User, emitting the related Domain Events.
   *
   * @param {UserCreateData} data
   * @param {string} source
   * @return Promise<User>
   */
  public async createUser(data: UserCreateData, source: string): Promise<User> {
    const user = new User({
      _id: this.userRepo.nextIdentity(),
      ...data,
    });

    const persistedUser = await this.userRepo.persist(user);
    await this.sendApplicationEvents(source, persistedUser);

    return persistedUser;
  }
}
