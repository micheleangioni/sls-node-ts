import { Model } from 'mongoose';
import { UserCreateData, UserData, UserUpdateData } from '../../domain/user/declarations';
import { IUserRepo } from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';

class UserRepo implements IUserRepo {
  protected userModel: Model<any>;

  constructor(userModel: Model<any>) {
    this.userModel = userModel;
  }

  /**
   * Return all Users as an array of User entities.
   *
   * @returns {Promise<User[]>}
   */
  public all (): Promise<User[]> {
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
  public findById (userId: string): Promise<User|null> {
    return new Promise((resolve, reject) => {
      this.userModel.findById(userId)
        .then((userData: UserData | null) => {
          if (!userData) {
            resolve(null);

            return;
          }

          resolve(new User(userData));
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Find and return a User by email.
   * Resolve null if no User is found.
   *
   * @param {string} email
   * @returns {Promise<User|null>}
   */
  public findByEmail (email: string): Promise<User|null> {
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
  public findByUsername (username: string): Promise<User|null> {
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
  public count (): Promise<number> {
    return new Promise((resolve, reject) => {
      this.userModel.count({})
        .then((count: number) => resolve(count))
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Create a new User.
   *
   * @param {UserCreateData} data
   * @returns {Promise<User>}
   */
  public create (data: UserCreateData ): Promise<User> {
    return new Promise((resolve, reject) => {
      this.userModel.create(data)
        .then((userData: UserData) => {
          resolve(new User(userData));
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Update input User.
   *
   * @param {string} userId
   * @param {UserUpdateData} data
   * @returns {Promise<User>}
   */
  public updateUser(userId: string, data: UserUpdateData): Promise<User> {
    return new Promise((resolve, reject) => {
      this.userModel.findByIdAndUpdate(userId, data)
        .then((userData: UserData) => {
          resolve(new User(userData));
        })
        .catch((error: any) => reject(error));
    });
  }
}

export default function (userModel: Model<any>): UserRepo {
  return new UserRepo(userModel);
}
