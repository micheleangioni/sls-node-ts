import mongoose, {Model} from 'mongoose';
import isRunningInLocalStack from '../utils/isRunningInLocalStack';
import usersSchema from './schemas/usersSchema';

export default async () => {
  const mongoUri = process.env.MONGO_URI
    ? process.env.MONGO_URI
    : isRunningInLocalStack
      ? 'mongodb://mongosls:27017/sls-node-ts-localstack'
      : `mongodb://127.0.0.1:27017/sls-node-ts-${process.env.ENV || ''}`;

  await mongoose.connect(mongoUri, {});

  // The following tweak allows for seeding in testing directly using Mongoose to handle DB operations

  // tslint:disable-next-line:variable-name
  let User: Model<any, any, any>;

  try {
    User = mongoose.model('users', usersSchema);
  } catch (error) {
    User = mongoose.model('users');
  }

  return {
    User,
    mongoose,
  };
};
