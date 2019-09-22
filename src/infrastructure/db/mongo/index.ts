import mongoose from 'mongoose';
import config from '../../../config';

const mongoConfig = config.mongo.connection;
export const mongoConnection = mongoose.createConnection(mongoConfig, { useNewUrlParser: true });

