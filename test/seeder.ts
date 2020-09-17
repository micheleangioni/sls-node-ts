import dayjs from 'dayjs';
import {Model} from 'mongoose';
import initializer from '../src/infrastructure/mongo';
import userRepoCreator, {UserRepo} from '../src/infrastructure/repos/userRepo';
import usersData from './testData/users.json';

let isMongoInitialized = false;
// tslint:disable-next-line:variable-name
let UserModel: Model<any>;
let userRepo: UserRepo;

export {userRepo};

export const getRepos = async (): Promise<{ userRepo: UserRepo }> => {
  if (!isMongoInitialized) {
    await initMongo();
  }

  return { userRepo };
};

const initMongo = async () => {
  UserModel = (await initializer()).User;
  userRepo = userRepoCreator(UserModel);
  isMongoInitialized = true;
};

export const seedDb = async (): Promise<true> => {
  if (!isMongoInitialized) {
    await initMongo();
  }

  const usersObjectData = usersData.map((userData) => ({
    ...userData,
    ...{
      createdAt: dayjs(userData.createdAt),
      updatedAt: dayjs(userData.updatedAt),
    },
  }));

  await UserModel.insertMany(usersObjectData);

  return true;
};

export const cleanDb = async (): Promise<true> => {
  if (!isMongoInitialized) {
    await initMongo();
  }

  await UserModel.deleteMany({});

  return true;
};
