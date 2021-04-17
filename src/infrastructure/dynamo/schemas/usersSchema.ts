import dynamoose from 'dynamoose';
import { Document } from 'dynamoose/dist/Document';
import isRunningLocally from '../../utils/isRunningLocally';

export interface User extends Document {
  _id: string;
  createdAt: Date;
  email: string;
  updatedAt: Date;
  username?: string;
}

// Adding the indexes from here would require the lambdas to have permissions to edit the Tables,
// which is something we don't want.
// For this reason, it's better to apply the least privilege principle and create the indexes directly in the
// Serverless.
// The indexes will be added here only when the application is running locally, including in tests.

const addIndexes = isRunningLocally;

export default new dynamoose.Schema({
  _id: {
    required: true,
    type: String,
  },
  email: {
    ...(addIndexes && {
      index: {
        global: true,
        name: 'index_email',
      },
    }),
    required: true,
    type: String,
  },
  username: {
    ...(addIndexes && {
      index: {
        global: true,
        name: 'index_username',
      },
    }),
    required: true,
    type: String,
  },
}, {
  timestamps: true,
});
