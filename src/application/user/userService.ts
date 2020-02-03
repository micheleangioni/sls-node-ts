import {AbstractApplicationService} from '../AbstractApplicationService';
import {ApplicationError} from '../ApplicationError';
import {ErrorCodes} from '../declarations';
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

    let persistedUser: User;

    try {
      persistedUser = await this.userRepo.persist(user);
    } catch (e) {
      if (e.code === 11000) {
        const message = e.keyValue && Object.keys(e.keyValue).length > 0
          ? `The ${Object.keys(e.keyValue)[0]} ${Object.values(e.keyValue)[0]} already exists`
          : 'Duplicated entry in the database';

        throw new ApplicationError({
          code: ErrorCodes.INVALID_DATA,
          message,
          statusCode: 412,
        });
      }

      throw e;
    }

    await this.sendApplicationEvents(source, persistedUser);

    return persistedUser;
  }
}
