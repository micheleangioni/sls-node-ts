import querystring from 'querystring';
import { MongoQuery } from './declarations';

const mongoProtocol = process.env.MONGO_PROTOCOL || 'mongodb';
const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || 27017;
const mongoDbName = process.env.MONGO_DB_NAME || 'sls-note-ts';
const mongoUsername = process.env.MONGO_USERNAME || '';
const mongoPassword = process.env.MONGO_PASSWORD || '';
const mongoReplicaSet = process.env.MONGO_REPLICA_SET || undefined;
const authSource = process.env.MONGO_AUTH_SOURCE || undefined; // 'admin'
const retryWrites = process.env.MONGO_RETRY_WRITES || 'true';

const portString = mongoPort ? `:${mongoPort}` : '';

const mongoQueryStringObj: MongoQuery = {
  maxPoolSize: process.env.MONGO_MAX_POOL_SIZE ? parseInt(process.env.MONGO_MAX_POOL_SIZE, 10) : 100,
};
if (mongoReplicaSet) {
  mongoQueryStringObj.replicaSet = mongoReplicaSet;
}
if (authSource) {
  mongoQueryStringObj.authSource = authSource;
}
if (retryWrites) {
  mongoQueryStringObj.retryWrites = retryWrites;
}

const mongoQueryString = querystring.stringify(mongoQueryStringObj);


const config = {
  mongo: {
    // tslint:disable-next-line:max-line-length
    connection: `${mongoProtocol}://${mongoUsername}:${mongoPassword}@${mongoHost}${portString}/${mongoDbName}?${mongoQueryString}`,
  },
};

export default config;
