import {IUserRepo} from '../../../src/domain/user/IUserRepo';
import {cleanDb, getRepos, seedDb} from '../../seeders/mongoSeeder';

describe('Test the Mongo User Repo, including the seeder', () => {
  let userRepo: IUserRepo;

  beforeAll(async () => {
    userRepo = (await getRepos()).userRepo;
  });

  describe('Test the .all() method', () => {
    beforeAll(async () => {
      await cleanDb();
      await seedDb();
    });

    test('It gets correctly gets the Users', async () => {
      const users = await userRepo.all();

      expect(users.length).toBe(2);
    });
  });
});
