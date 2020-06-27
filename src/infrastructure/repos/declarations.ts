import {BaseUserData, Timestamps} from '../../domain/user/declarations';

export type ToBePersistedUserData = BaseUserData;
export type PersistedUserData = ToBePersistedUserData & Required<Timestamps>;
