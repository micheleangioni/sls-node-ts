export type MongoQuery = {
  authSource?: string,
  maxPoolSize: number,
  readPreference?: string,
  replicaSet?: string,
  retryWrites?: string,
  ssl?: string,
};
