import { Mongoose } from 'mongoose';
import userSchemaCreator from './usersSchema';

export default function (mongoose: Mongoose) {
  const usersSchema = userSchemaCreator(mongoose);
  let model: any;

  // The following tweak allows for seeding in testing directly using Mongoose to handle DB operations
  try {
    model = mongoose.model('users', usersSchema);
  } catch (error) {
    model = mongoose.model('users');
  }

  return model;
}
