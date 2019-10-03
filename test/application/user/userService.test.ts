import UserService from '../../../src/application/user/userService';
import {UserCreateData} from '../../../src/domain/user/declarations';
import {cleanDb, seedDb} from '../../seeder';
import {userRepo} from '../../seeder';

describe('Test the User Application Service', () => {
  const userService = new UserService(userRepo);

  beforeAll(async (done) => {
    await cleanDb();
    done();
  });

  afterAll(async (done) => {
    await cleanDb();
    done();
  });

  describe('Test getAll()', () => {
    beforeAll(async (done) => {
      await cleanDb();
      await seedDb();
      done();
    });

    test('It correctly gets the users', async (done) => {
      const users = await userService.getAll();

      expect(users.length).toBe(2);
      done();
    });
  });

  describe('Test createUser()', () => {
    beforeEach(async (done) => {
      await cleanDb();
      done();
    });

    afterEach(async (done) => {
      await cleanDb();
      done();
    });

    test('It correctly creates a User', async (done) => {
      const userData: UserCreateData = {
        email: 'michele@test.com',
        username: 'Michele',
      };
      const user = await userService.createUser(userData);

      expect(user._id).not.toBe(undefined);
      expect(user.email).toBe(userData.email);
      expect(user.username).toBe(userData.username);
      expect(user.createdAt).not.toBe(undefined);
      expect(user.updatedAt).not.toBe(undefined);
      done();
    });

    test('It gets a error if trying to add a User twice', async (done) => {
      const userData: UserCreateData = {
        email: 'michele_new@test.com',
        username: 'Michele New',
      };

      await userService.createUser(userData);
      await expect(userService.createUser(userData)).rejects.toThrow();

      done();
    });
  });
});
