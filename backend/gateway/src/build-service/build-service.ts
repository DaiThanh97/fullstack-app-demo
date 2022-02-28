import { Logger, Module } from '@nestjs/common';
import { GraphQLResponse, GraphQLRequest } from 'apollo-server-core';
import { RemoteGraphQLDataSource } from '@apollo/gateway';
import { maskSensitiveData } from '../utils/logger/nestjs-winston-logger.utils';

export class CustomizedDataSource extends RemoteGraphQLDataSource {
  private readonly logger = new Logger();

  async willSendRequest({
    request,
    context,
  }: {
    request: GraphQLRequest;
    context: Record<string, any>;
  }) {
    if (!request.http) {
      throw new Error("Internal error: Only 'http' requests are supported");
    }
    for (const ctx in context) {
      request.http.headers.set(ctx, context[ctx] as string);
    }
    this.logger.log(JSON.stringify(maskSensitiveData(request)));
  }

  async didReceiveResponse({
    response,
  }: {
    request: GraphQLRequest;
    response: GraphQLResponse;
  }) {
    this.logger.log(JSON.stringify(response));
    return response;
  }
}
