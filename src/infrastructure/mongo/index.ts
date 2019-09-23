import mongoose, {Model} from 'mongoose';
import config from '../../config';
import usersSchema from './schemas/usersSchema';

mongoose.connect(config.mongo.connection, {useNewUrlParser: true})
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
