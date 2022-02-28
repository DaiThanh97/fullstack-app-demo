import { StatusCode } from './errors';

export type TBaseApi = {
  code: StatusCode;
  status: string;
  message?: string;
};

export type TResponse<T> = { [key in keyof T]: T[keyof T] } & TBaseApi;
