import dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';

export interface User extends Document {
  _id: string;
  createdAt: Date;
  email: string;
  updatedAt: Date;
  username?: string;
}

// Adding the indexes from here would require the lambdas to have permissions to edit the Tables,
// which is something we don't want. For this reason, the indexes are created beforehand,
// via Serverless Framework when deploying or docker-compose locally.

export default new dynamoose.Schema({
  _id: {
    required: true,
    type: String,
  },
  email: {
    index: {
      global: true,
      name: 'index_email',
    },
    required: true,
    type: String,
  },
  username: {
    index: {
      global: true,
      name: 'index_username',
    },
    type: String,
  },
}, {
  timestamps: true,
});
