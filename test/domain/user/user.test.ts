import dayjs, {Dayjs} from 'dayjs';
import {IUserRepo} from '../../../src/domain/user/IUserRepo';
import User from '../../../src/domain/user/user';
import {getRepos} from '../../seeders/dynamoSeeder';

describe('Test the User Entity', () => {
  let userRepo: IUserRepo;

  beforeAll((done) => {
    userRepo = getRepos().userRepo;
    done();
  });

  describe('Test instantiation', () => {
    test('It gets correctly instantiated', (done) => {
      const createdAt = dayjs('2019-09-25T20:50:00.302Z').toDate();
      const email = 'test@test.com';
      const updatedAt = dayjs('2019-09-25T22:00:00.143Z').toDate();
      const username = 'Test';

      const userData = {
        _id: userRepo.nextIdentity(),
        createdAt,
        email,
        updatedAt,
        username,
      };

      const user = new User(userData);

      expect((user.createdAt as Dayjs).toISOString()).toBe(createdAt.toISOString());
      expect(user.email).toBe(email);
      expect((user.updatedAt as Dayjs).toISOString()).toBe(updatedAt.toISOString());
      expect(user.username).toBe(username);
      done();
    });
  });
});
