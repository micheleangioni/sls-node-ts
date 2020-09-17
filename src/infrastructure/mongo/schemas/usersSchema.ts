import {Schema} from 'mongoose';

export default new Schema({
  email: { required: true, type: String, unique: true },
  username: { sparse: true, type: String, unique: true },
}, { timestamps: true });
