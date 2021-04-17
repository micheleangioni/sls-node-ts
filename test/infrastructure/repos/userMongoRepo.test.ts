import {IUserRepo} from '../../../src/domain/user/IUserRepo';
import {cleanDb, getRepos, seedDb} from '../../seeders/mongoSeeder';

describe('Test the Mongo User Repo, including the seeder', () => {
  let userRepo: IUserRepo;

  beforeAll(async (done) => {
    userRepo = (await getRepos()).userRepo;
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
