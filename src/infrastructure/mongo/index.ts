import mongoose from 'mongoose';
import config from '../../config';

mongoose.connect(config.mongo.connection, {useNewUrlParser: true})
  .catch((e: any) => {
    throw e;
  });

export default mongoose;
