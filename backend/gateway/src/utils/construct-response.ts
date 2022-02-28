import { GraphQLResponse } from 'apollo-server-core';

export enum StatusCode {
  SUCCESS = 'SUCCESS',
  DATABASE_CONNECTION_ERROR = 'DATABASE_CONNECTION_ERROR',
  HOST_NOT_AVAILABLE = 'HOST_NOT_AVAILABLE',
  INTERNAL_SYSTEM_ERROR = 'INTERNAL_SYSTEM_ERROR',
  API_INTEGRATION_ERROR = 'API_INTEGRATION_ERROR', // Code from API
  API_OBSOLETE = 'API_OBSOLETE',
  FORBIDDEN = 'FORBIDDEN',
  UNAUTHENTICATED = 'UNAUTHENTICATED',
  BAD_USER_INPUT = 'BAD_USER_INPUT',
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_RECORD = 'DUPLICATE_RECORD',
  REQUEST_TIMEOUT = 'REQUEST_TIMEOUT',
}

export const COMMON_STATUS = {
  [StatusCode.SUCCESS]: '0',
  [StatusCode.DATABASE_CONNECTION_ERROR]: '1',
  [StatusCode.HOST_NOT_AVAILABLE]: '2',
  [StatusCode.INTERNAL_SYSTEM_ERROR]: '3',
  [StatusCode.API_OBSOLETE]: '4',
  [StatusCode.FORBIDDEN]: '11',
  [StatusCode.UNAUTHENTICATED]: '12',
  [StatusCode.BAD_USER_INPUT]: '13',
  [StatusCode.NOT_FOUND]: '14',
  [StatusCode.DUPLICATE_RECORD]: '15',
  [StatusCode.REQUEST_TIMEOUT]: '16',
};

const code = (prefix: string, code: string) => prefix + '.' + code;

export function constructResponse(gqlRes: GraphQLResponse): GraphQLResponse {
  if (!gqlRes.data) {
    gqlRes.data = {};
  }

  if (gqlRes?.errors && gqlRes?.errors?.length > 0) {
    const error = gqlRes.errors[0];
    gqlRes.data.message = error.message;
    gqlRes.data.code = error?.extensions?.code;

    if (gqlRes.data.code === StatusCode.API_INTEGRATION_ERROR) {
      gqlRes.data.status = error?.extensions?.status;
    } else if (COMMON_STATUS[gqlRes.data.code as keyof typeof COMMON_STATUS]) {
      gqlRes.data.status =
        COMMON_STATUS[gqlRes.data.code as keyof typeof COMMON_STATUS];
    } else if (
      !COMMON_STATUS[gqlRes.data.code as keyof typeof COMMON_STATUS] &&
      error?.extensions?.status
    ) {
      gqlRes.data.status = error.extensions.status;
    }

    return gqlRes;
  }

  gqlRes.data.code = StatusCode.SUCCESS;
  gqlRes.data.status =
    COMMON_STATUS[gqlRes.data.code as keyof typeof COMMON_STATUS];

  return gqlRes;
}
