import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { RequestContextModule } from '@medibloc/nestjs-request-context';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ENV_CONFIG, validate } from './configs/env';
import { RequestContext } from './request-context';
import { GraphQLModule } from '@nestjs/graphql';
import {
  IntrospectAndCompose,
  ServiceEndpointDefinition,
} from '@apollo/gateway';
import { constructResponse, formatError } from './utils';
import { CustomizedDataSource } from './build-service/build-service';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [ENV_CONFIG],
      validate,
    }),
    RequestContextModule.forRoot({
      contextClass: RequestContext,
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const isProd = configService.get<boolean>('IS_PROD');
        const introspection = configService.get<boolean>('INTROSPECTION');
        const orderServiceUrl = configService.get<string>('ORDER_SERVICE_URL');
        return {
          gateway: {
            supergraphSdl: new IntrospectAndCompose({
              subgraphs: [{ name: 'orders', url: orderServiceUrl }],
              subgraphHealthCheck: true,
            }),
            buildService: ({ url }: ServiceEndpointDefinition) =>
              new CustomizedDataSource({ url }),
          },
          server: {
            path: '/data',
            cors: true,
            introspection,
            debug: !isProd,
            context: ({ req }) => ({ ...req.headers }),
            formatError: formatError,
            formatResponse: constructResponse,
          },
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
