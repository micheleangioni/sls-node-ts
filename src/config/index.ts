const env = process.env.ENV;

const config = {
  // This secret must contain all needed environment variables of the application (eg. MONGO_URI)
  secret: `sls-node-ts/${env}`,
};

export default config;
