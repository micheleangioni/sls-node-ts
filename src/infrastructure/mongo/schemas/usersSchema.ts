import {Schema} from 'mongoose';

export default new Schema({
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true, sparse: true },
}, { timestamps: true });
