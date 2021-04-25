import {IUserRepo} from '../../../src/domain/user/IUserRepo';
import {cleanDb, getRepos, seedDb} from '../../seeders/dynamoSeeder';

describe('Test the Dynamo User Repo, including the seeder', () => {
  let userRepo: IUserRepo;

  beforeAll((done) => {
    userRepo = getRepos().userRepo;
    done();
  });

  beforeAll(async (done) => {
    await cleanDb();
    await seedDb();
    done();
  });

  describe('Test the .all() method', () => {
    test('It gets correctly gets the Users', async (done) => {
      const users = await userRepo.all();

      expect(users.length).toBe(2);
      done();
    });
  });

  describe('Test the .findByEmail() method', () => {
    test('It gets correctly gets the Users', async (done) => {
      const user = await userRepo.findByEmail('test1@test.com');

      expect(user && user.email).toBe('test1@test.com');
      done();
    });
  });

  describe('Test the .findByUsername() method', () => {
    test('It gets correctly gets the Users', async (done) => {
      const user = await userRepo.findByUsername('Test1');

      expect(user && user.username).toBe('Test1');
      done();
    });
  });
});
