import {name} from '../../package.json';
const env = process.env.ENV || '';

const config = {
  // This secret must contain all needed environment variables of the application (eg. MONGO_URI)
  secret: `${name}/${env}`,

  sns: {
    topics: {
      user: {
        topic: 'events_aggregate_user',
      },

      /**
       *  Add new aggregates with their own topics in the format
       *
       * {
       *   <aggregate>: {
       *     topic: <topic_name>
       *   }
       * }
       */
    },
  },
};

export default config;
