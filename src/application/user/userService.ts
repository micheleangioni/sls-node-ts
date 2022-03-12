import {IUserRepo} from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';
import {AbstractApplicationService} from '../AbstractApplicationService';
import {ApplicationError} from '../ApplicationError';
import {ErrorCodes} from '../declarations';
import EventPublisher from '../eventPublisher';
import {UserCreateData} from './declarations';

export default class UserService extends AbstractApplicationService {
  constructor(private readonly userRepo: IUserRepo, eventPublisher: EventPublisher) {
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

    // Check whether a User with the same email or username already exists

    if (await this.userRepo.findByEmail(data.email)) {
      throw new ApplicationError({
        code: ErrorCodes.FORBIDDEN,
        error: 'Email already taken',
        statusCode: 403,
      });
    }

    if (data.username && await this.userRepo.findByUsername(data.username)) {
      throw new ApplicationError({
        code: ErrorCodes.FORBIDDEN,
        error: 'Username already taken',
        statusCode: 403,
      });
    }

    let persistedUser: User;

    try {
      // eslint-disable-next-line prefer-const
      persistedUser = await this.userRepo.persist(user);
    } catch (e) {
      if (e.code === 11000) {
        const message = e.keyValue && Object.keys(e.keyValue).length > 0
          ? `The ${Object.keys(e.keyValue)[0]} ${Object.values(e.keyValue)[0] as string} already exists`
          : 'Duplicated entry in the database';

        throw new ApplicationError({
          code: ErrorCodes.INVALID_DATA,
          error: message,
          statusCode: 412,
        });
      }

      throw e;
    }

    await this.sendApplicationEvents(source, persistedUser);

    return persistedUser;
  }
}
