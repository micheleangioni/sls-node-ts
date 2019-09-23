import {User} from './mongo';
import userRepoCreator from './repos/userRepo';

export const userRepo = userRepoCreator(User);
