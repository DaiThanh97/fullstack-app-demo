import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';
import { CommonError } from 'src/common/errors';
import { ApolloError } from 'apollo-server-core';

@Catch()
export class AllExceptionFilter implements GqlExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const gqlError = error as CommonError;
    return new ApolloError(
      gqlError.message,
      gqlError.code,
      gqlError.extensions,
    );
  }
}
