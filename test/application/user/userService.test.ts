import EventPublisher from '../../../src/application/eventPublisher';
import UserService from '../../../src/application/user/userService';
import {UserCreateData} from '../../../src/application/user/declarations';
import {UserCreated} from '../../../src/domain/user/events/UserCreated';
import {cleanDb, getRepos, seedDb} from '../../seeders/dynamoSeeder';

jest.setTimeout(20000);

describe('Test the User Application Service', () => {
  const mockPublish = jest.fn();
  // @ts-ignore
  const mockEventPublisherFactory = jest.fn<EventPublisher, []>().mockImplementation(() => {
    return {
      publish: mockPublish,
    };
  });

  let userService: UserService;

  beforeAll(async () => {
    process.env.SEND_DOMAIN_EVENTS = 'true';
    await cleanDb();

    const userRepo = getRepos().userRepo;
    const mockEventPublisher = new mockEventPublisherFactory();
    userService = new UserService(userRepo, mockEventPublisher);
  });

  afterAll(async () => {
    delete process.env.SEND_DOMAIN_EVENTS;
    await cleanDb();
  });

  describe('Test getAll()', () => {
    beforeAll(async () => {
      await cleanDb();
      await seedDb();
    });

    test('It correctly gets the users', async () => {
      const users = await userService.getAll();

      expect(users.length).toBe(2);
    });
  });

  describe('Test createUser()', () => {
    beforeEach(async () => {
      await cleanDb();
    });

    afterEach(async () => {
      await cleanDb();
      mockPublish.mockReset();
    });

    test('It correctly creates a User', async () => {
      const userData: UserCreateData = {
        email: 'michele@test.com',
        username: 'Michele',
      };
      const user = await userService.createUser(userData, '/users');

      expect(user._id).not.toBe(undefined);
      expect(user.email).toBe(userData.email);
      expect(user.username).toBe(userData.username);
      expect(user.createdAt).not.toBe(undefined);
      expect(user.updatedAt).not.toBe(undefined);

      expect(mockPublish).toBeCalledTimes(1);
      expect(mockPublish.mock.calls[0][1][0]).toBeInstanceOf(UserCreated);
      expect(mockPublish.mock.calls[0][1][0].getEventData()).toMatchObject({
        _id: user._id,
        createdAt: user.createdAt?.toISOString(),
        email: user.email,
        username: user.username,
      });
    });

    test('It gets a error if trying to add a User twice', async () => {
      const userData: UserCreateData = {
        email: 'michele_new@test.com',
        username: 'Michele New',
      };

      await userService.createUser(userData, '/users');
      await expect(userService.createUser(userData, '/users')).rejects.toThrow();
    });
  });
});
