export type Timestamps = {
  createdAt?: Date;
  updatedAt?: Date;
};

export type BaseUserData = {
  _id: string;
  email: string;
  username?: string;
};

export type UserData = BaseUserData & Timestamps;
