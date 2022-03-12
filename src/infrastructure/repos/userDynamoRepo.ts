import dayjs from 'dayjs';
import {QueryResponse} from 'dynamoose/dist/DocumentRetriever';
import {ModelType} from 'dynamoose/dist/General';
import { v4 as uuidv4 } from 'uuid';
import {IUserRepo} from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';
import { User as UserModel } from '../dynamo/schemas/usersSchema';
import {PersistedUserData, ToBePersistedUserData} from './declarations';

export class UserDynamoRepo implements IUserRepo {
  constructor(private readonly userModel: ModelType<UserModel>) {}

  /**
   * Create and return a id.
   *
   * @return string
   */
  public nextIdentity(): string {
    return uuidv4();
  }

  /**
   * Return all Users as an array of User entities.
   *
   * @returns {Promise<User[]>}
   */
  public async all(): Promise<User[]> {
    return (await this.userModel.scan().all().exec() as QueryResponse<UserModel>)
      .map((userModel) => new User(userModel));
  }

  /**
   * Find and return a User by id.
   * Resolve null if no User is found.
   *
   * @param {string} userId
   * @returns {Promise<User | null>}
   */
  public async findById(userId: string): Promise<User | null> {
    const userData = await this.userModel.get(userId);

    return userData && new User(userData);
  }

  /**
   * Find and return a User by email.
   * Resolve null if no User is found.
   *
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  public async findByEmail(email: string): Promise<User|null> {
    const userRecord = await this.userModel.query('email')
      .eq(email).using('index_email').exec() as QueryResponse<UserModel>;

    return userRecord.length > 0
      ? new User(userRecord[0])
      : null;
  }

  /**
   * Find and return a User by username.
   * Resolve null if no User is found.
   *
   * @param {string} username
   * @returns {Promise<User|null>}
   */
  public async findByUsername(username: string): Promise<User|null> {
    const userRecord = await this.userModel.query('username')
      .eq(username).using('index_username').exec() as QueryResponse<UserModel>;

    return userRecord.length > 0
      ? new User(userRecord[0])
      : null;
  }

  /**
   * Count the number of Users.
   *
   * @return {Promise<number>}
   */
  public async count(): Promise<number> {
    return (await this.userModel.scan().all().count().exec()).count as number;
  }

  /**
   * Persist input User.
   *
   * @param {User} user
   * @returns {Promise<User>}
   */
  public async persist(user: User): Promise<User> {
    const dataToBePersisted: ToBePersistedUserData = this.getDataToBePersisted(user);

    if (user.createdAt) {
      const updatedUser: PersistedUserData = await this.userModel.update(
        { _id: user._id },
        dataToBePersisted,
      );

      user.updateDates(dayjs(updatedUser.updatedAt));
    } else {
      const createdUser: PersistedUserData = await this.userModel.create(dataToBePersisted);

      user.updateDates(dayjs(createdUser.updatedAt));
    }

    return user;
  }

  private getDataToBePersisted(user: User): ToBePersistedUserData {
    return {
      _id: user._id,
      email: user.email,
      ...(user.username && { username: user.username }),
    };
  }
}

export default (userModel: ModelType<UserModel>): UserDynamoRepo => {
  return new UserDynamoRepo(userModel);
};
