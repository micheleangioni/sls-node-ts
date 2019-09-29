import mongoose, {Model} from 'mongoose';
import usersSchema from './schemas/usersSchema';

const mongoUri = process.env.MONGO_URI
  ? process.env.MONGO_URI
  : `mongodb://localhost:27017/sls-node-ts-${process.env.NODE_ENV}`;

mongoose.connect(mongoUri, {useNewUrlParser: true})
  .catch((e: any) => {
    throw e;
  });

// The following tweak allows for seeding in testing directly using Mongoose to handle DB operations

// tslint:disable-next-line:variable-name
let User: Model<any>;

try {
  User = mongoose.model('users', usersSchema);
} catch (error) {
  User = mongoose.model('users');
}

export {User};

export default mongoose;
