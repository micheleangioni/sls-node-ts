import moment = require('moment-timezone');
import {Model} from 'mongoose';
import initializer from '../src/infrastructure/mongo';
import userRepoCreator, {UserRepo} from '../src/infrastructure/repos/userRepo';
import usersData from './testData/users.json';

let isMongoInitialized = false;
// tslint:disable-next-line:variable-name
let UserModel: Model<any>;
let userRepo: UserRepo;

export {userRepo};

export async function getRepos(): Promise<{ userRepo: UserRepo }> {
  if (!isMongoInitialized) {
    await initMongo();
  }

  return { userRepo };
}

async function initMongo() {
  UserModel = (await initializer()).User;
  userRepo = userRepoCreator(UserModel);
  isMongoInitialized = true;
}

export async function seedDb(): Promise<true> {
  if (!isMongoInitialized) {
    await initMongo();
  }

  const usersObjectData = usersData.map((userData) => ({
    ...userData,
    ...{
      createdAt: moment(userData.createdAt),
      updatedAt: moment(userData.updatedAt),
    },
  }));

  await UserModel.insertMany(usersObjectData);

  return true;
}

export async function cleanDb(): Promise<true> {
  if (!isMongoInitialized) {
    await initMongo();
  }

  await UserModel.deleteMany({});

  return true;
}
