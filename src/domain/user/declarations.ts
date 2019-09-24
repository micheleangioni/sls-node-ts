export type UserData = {
  _id?: string,
  createdAt?: Date,
  email: string,
  updatedAt?: Date,
  username: string|undefined|null,
};

export type UserCreateData = {
  email: string,
  username?: string,
};

export type UserUpdateData = {
  username?: string,
};
