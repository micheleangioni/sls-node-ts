import {IUserRepo} from '../../../src/domain/user/IUserRepo';
import {cleanDb, getRepos, seedDb} from '../../seeders/dynamoSeeder';

describe('Test the Dynamo User Repo, including the seeder', () => {
  let userRepo: IUserRepo;

  beforeAll((done) => {
    userRepo = getRepos().userRepo;
    done();
  });

  describe('Test the .all() method', () => {
    beforeAll(async (done) => {
      await cleanDb();
      await seedDb();
      done();
    });

    test('It gets correctly gets the Users', async (done) => {
      const users = await userRepo.all();

      expect(users.length).toBe(2);
      done();
    });
  });
});
