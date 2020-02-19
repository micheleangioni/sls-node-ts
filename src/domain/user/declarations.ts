export type BaseUserData = {
  _id: string;
  email: string;
  username?: string;
};

export type UserData = BaseUserData & {
  createdAt?: Date;
  updatedAt?: Date;
};
