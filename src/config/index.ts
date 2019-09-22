import querystring from 'querystring';
import {MongoQuery} from './declarations';

const env = process.env.NODE_ENV || 'development';

const mongoProtocol = process.env.MONGO_PROTOCOL || 'mongodb';
const mongoHost = process.env.MONGO_HOST || 'localhost';
const mongoPort = process.env.MONGO_PORT || undefined;
const mongoDbName = process.env.MONGO_DB_NAME ?
  process.env.MONGO_DB_NAME :
  ['test', 'testing'].includes(env) ?
    'citySettingsTest' :
    'citySettings';

const mongoUsername = process.env.MONGO_USERNAME || '';
const mongoPassword = process.env.MONGO_PASSWORD || '';
const mongoReplicaSet = process.env.MONGO_REPLICA_SET || undefined;
const mongoAtlas = process.env.MONGO_ATLAS || 'false';

const portString = mongoPort ? `:${mongoPort}` : '';

const mongoQueryStringObj: MongoQuery = {
  maxPoolSize: process.env.MONGO_MAX_POOL_SIZE ? parseInt(process.env.MONGO_MAX_POOL_SIZE, 10) : 100,
  // readPreference: 'secondaryPreferred',
};
if (mongoReplicaSet) {
  mongoQueryStringObj.replicaSet = mongoReplicaSet;
}
if (mongoAtlas === 'true') {
  mongoQueryStringObj.authSource = 'admin';
  mongoQueryStringObj.retryWrites = 'true';
  mongoQueryStringObj.ssl = 'true';
}

const mongoQueryString = querystring.stringify(mongoQueryStringObj);
const mongoURI = `${mongoProtocol}://${mongoUsername}:${mongoPassword}@${mongoHost}${portString}/${mongoDbName}?${mongoQueryString}`;

export default {
  mongo: {
    connection: mongoURI,
  },
};
