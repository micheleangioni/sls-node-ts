import { name } from '../../package.json';
const env = process.env.ENV;

const config = {
  // This secret must contain all needed environment variables of the application (eg. MONGO_URI)
  secret: `${name}/${env}`,
};

export default config;
