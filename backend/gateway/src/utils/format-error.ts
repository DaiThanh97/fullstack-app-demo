import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { COMMON_STATUS, StatusCode } from './construct-response';

export function formatError(err: GraphQLError): GraphQLFormattedError {
  const code = err?.extensions?.code ?? '';
  const isCustomError = err?.extensions?.customError ?? false;

  if (
    !isCustomError &&
    code !== StatusCode.API_INTEGRATION_ERROR &&
    !COMMON_STATUS[code as keyof typeof COMMON_STATUS] &&
    err.extensions
  ) {
    err.extensions.code = StatusCode.INTERNAL_SYSTEM_ERROR;
  }

  return err;
}
