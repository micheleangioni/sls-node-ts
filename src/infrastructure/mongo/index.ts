import {name} from '../../../package.json';
import mongoose, {Model} from 'mongoose';
import usersSchema from './schemas/usersSchema';

export default async () => {
  const mongoUri = process.env.MONGO_URI
    ? process.env.MONGO_URI
    : process.env.ENV === 'local'
      ? `mongodb://mongosls:27017/${name}-${process.env.ENV}`
      : `mongodb://127.0.0.1:27017/${name}-${process.env.ENV || ''}`;

  await mongoose.connect(mongoUri, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });

  // The following tweak allows for seeding in testing directly using Mongoose to handle DB operations

  // tslint:disable-next-line:variable-name
  let User: Model<any>;

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
