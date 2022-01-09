import AWS from 'aws-sdk';
import dayjs from 'dayjs';
import {QueryResponse} from 'dynamoose/dist/DocumentRetriever';
import {ModelType} from 'dynamoose/dist/General';
import {IUserRepo} from '../../src/domain/user/IUserRepo';
import initializer from '../../src/infrastructure/dynamo';
import {User as UserModel} from '../../src/infrastructure/dynamo/schemas/usersSchema';
import userRepoCreator from '../../src/infrastructure/repos/userDynamoRepo';
import usersData from '../testData/users.json';

let isDynamoInitialized = false;
// tslint:disable-next-line:variable-name
let UserModel: ModelType<UserModel>;
let userRepo: IUserRepo;

AWS.config.region = 'eu-west-1';

export {userRepo};

export const getRepos = (): { userRepo: IUserRepo } => {
  if (!isDynamoInitialized) {
    initDynamo();
  }

  return { userRepo };
};

const initDynamo = () => {
  UserModel = initializer().User;
  userRepo = userRepoCreator(UserModel);
  isDynamoInitialized = true;
};

export const seedDb = async (): Promise<true> => {
  if (!isDynamoInitialized) {
    initDynamo();
  }

  const usersObjectData = usersData.map((userData) => ({
    ...userData,
    ...{
      createdAt: dayjs(userData.createdAt),
      updatedAt: dayjs(userData.updatedAt),
    },
  }));

  await UserModel.batchPut(usersObjectData);

  return true;
};

export const cleanDb = async (): Promise<true> => {
  if (!isDynamoInitialized) {
    initDynamo();
  }

  const models = (await UserModel.scan().all().exec()) as QueryResponse<UserModel>;

  if (models.length > 0) {
    await UserModel.batchDelete(models.map((model) => model._id));
  }

  return true;
};
