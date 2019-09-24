import {Model} from 'mongoose';
import {UserCreateData, UserData, UserUpdateData} from '../../domain/user/declarations';
import {IUserRepo} from '../../domain/user/IUserRepo';
import User from '../../domain/user/user';

class UserRepo implements IUserRepo {
  constructor(private userModel: Model<any>) { this.userModel = userModel; }

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
   * @param {User} user
   * @returns {Promise<User>}
   */
  public create (user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      const createData: UserCreateData = {
        email: user.email,
        password: user.password,
        username: user.username,
      };

      this.userModel.create(createData)
        .then((userData: UserData) => {
          resolve(new User(userData));
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Update input User with updatable fields.
   *
   * @param {User} user
   * @returns {Promise<User>}
   */
  public updateUser(user: User): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!user._id) {
        return reject('Cannot update a non persisted User');
      }

      const updateData: UserUpdateData = {
        username: user.username,
      };

      this.userModel.findByIdAndUpdate(user._id, updateData)
        .then((userData: UserData | null) => {
          if (!userData) {
            return reject(`User ${user._id} not found`);
          }

          resolve(new User(userData));
        })
        .catch((error: any) => reject(error));
    });
  }
}

export default function (userModel: Model<any>): UserRepo {
  return new UserRepo(userModel);
}
