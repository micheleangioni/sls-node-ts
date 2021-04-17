import dayjs from 'dayjs';
import {Model, mongo} from 'mongoose';
import {UserData} from '../../domain/user/declarations';
import {IUserRepo} from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';
import {PersistedUserData, ToBePersistedUserData} from './declarations';

export class UserMongoRepo implements IUserRepo {
  constructor(private readonly userModel: Model<any>) {}

  /**
   * Create and return a new MongoDB id.
   *
   * @return string
   */
  public nextIdentity(): string {
    return new mongo.ObjectID().toString();
  }

  /**
   * Return all Users as an array of User entities.
   *
   * @returns {Promise<User[]>}
   */
  public all(): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.userModel.find()
        .then((data: UserData[]) => resolve(data.map((userData: UserData) => new User(userData))))
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Find and return a User by id.
   * Resolve null if no User is found.
   *
   * @param {string} userId
   * @returns {Promise<User|null>}
   */
  public findById(userId: string): Promise<User|null> {
    return new Promise((resolve, reject) => {
      this.userModel.findById(userId)
        .then((userData: UserData | null) => {
          if (!userData) {
            resolve(null);

            return;
          }

          resolve(new User(userData));
        })
        .catch((error: any) => {
          if (error.name === 'CastError') {
            return resolve(null);
          }

          reject(error);
        });
    });
  }

  /**
   * Find and return a User by email.
   * Resolve null if no User is found.
   *
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  public findByEmail(email: string): Promise<User|null> {
    return new Promise((resolve, reject) => {
      this.userModel.findOne({ email })
        .then((userData: UserData | null) => {
          if (userData === null) {
            resolve(null);

            return;
          }

          resolve(new User(userData));
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Find and return a User by username.
   * Resolve null if no User is found.
   *
   * @param {string} username
   * @returns {Promise<User|null>}
   */
  public findByUsername(username: string): Promise<User|null> {
    return new Promise((resolve, reject) => {
      this.userModel.findOne({ username })
        .then((userData: UserData | null) => {
          if (userData === null) {
            resolve(null);

            return;
          }

          resolve(new User(userData));
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Count the number of Users.
   *
   * @return {Promise<number>}
   */
  public count(): Promise<number> {
    return new Promise((resolve, reject) => {
      this.userModel.count({})
        .then((count: number) => resolve(count))
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Persist input User.
   *
   * @param {User} user
   * @returns {Promise<User>}
   */
  public async persist(user: User): Promise<User> {
    const dataToBePersisted: ToBePersistedUserData = this.getDataToBePersisted(user);

    const persistedUser: PersistedUserData = await this.userModel.findOneAndUpdate(
      { _id: user._id },
      dataToBePersisted,
      { new: true, upsert: true }).lean();

    user.updateDates(dayjs(persistedUser.updatedAt));

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

export default (userModel: Model<any>): UserMongoRepo => {
  return new UserMongoRepo(userModel);
};
