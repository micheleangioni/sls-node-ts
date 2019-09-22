import mongoose from 'mongoose';

export default function (mongooseClient: typeof mongoose) {
  const { Schema } = mongooseClient;

  return new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
  }, { timestamps: true });
}
