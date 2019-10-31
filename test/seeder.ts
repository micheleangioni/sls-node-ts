// @ts-ignore
import moment = require('moment-timezone');
import {User as UserModel} from '../src/infrastructure/mongo';
import userRepoCreator from '../src/infrastructure/repos/userRepo';
import usersData from './testData/users.json';

const userRepo = userRepoCreator(UserModel);

export {userRepo};

export async function seedDb(): Promise<true> {
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
    await UserModel.deleteMany({});

    return true;
}
