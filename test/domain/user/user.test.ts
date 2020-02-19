import moment from 'moment-timezone';
import { Moment } from 'moment-timezone/moment-timezone';
import User from '../../../src/domain/user/user';
import { UserRepo } from '../../../src/infrastructure/repos/userRepo';
import { getRepos } from '../../seeder';

describe('Test the User Entity', () => {
  let userRepo: UserRepo;

  beforeAll(async (done) => {
    userRepo = (await getRepos()).userRepo;
    done();
  });

  describe('Test instantiation', () => {
    test('It gets correctly instantiated', (done) => {
      const createdAt = moment('2019-09-25T20:50:00.302Z').toDate();
      const email = 'test@test.com';
      const updatedAt = moment('2019-09-25T22:00:00.143Z').toDate();
      const username = 'Test';

      const userData = {
        _id: userRepo.nextIdentity(),
        createdAt,
        email,
        updatedAt,
        username,
      };

      const user = new User(userData);

      expect((user.createdAt as Moment).toISOString()).toBe(createdAt.toISOString());
      expect(user.email).toBe(email);
      expect((user.updatedAt as Moment).toISOString()).toBe(updatedAt.toISOString());
      expect(user.username).toBe(username);
      done();
    });
  });
});
