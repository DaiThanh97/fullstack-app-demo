import {
  ApolloFederationDriver,
  ApolloFederationDriverConfig,
} from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ApolloServerPluginInlineTraceDisabled } from 'apollo-server-core';
import { BullModule } from '@nestjs/bull';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { join } from 'path';
import { ENV_CONFIG, validate } from './configs/env';
import { OrderModule } from './order/order.module';
import { AllExceptionFilter } from './utils/filter/all-exceptions.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [ENV_CONFIG],
      isGlobal: true,
      cache: true,
      validate,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const mongoUser = configService.get<string>('MONGO_USER');
        const mongoHost = configService.get<string>('MONGO_HOST');
        const mongoPwd = configService.get<string>('MONGO_PASSWORD');
        const mongoDb = configService.get<string>('MONGO_DATABASE');
        const mongoUri = `mongodb://${mongoUser}:${mongoPwd}@${mongoHost}/${mongoDb}?authSource=admin&readPreference=primary`;

        return {
          uri: mongoUri,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        };
      },
    }),
    GraphQLModule.forRootAsync<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        debug: !configService.get<string>('IS_PROD'),
        playground: configService.get<boolean>('OPEN_PLAYGROUND'),
        typePaths: ['./**/*.graphql'],
        definitions: {
          path: join(process.cwd(), 'src', 'graphql.ts'),
          outputAs: 'class',
        },
        context: ({ req }) => ({
          headers: req.headers,
        }),
        plugins: [ApolloServerPluginInlineTraceDisabled()],
      }),
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
        },
      }),
    }),
    OrderModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
  ],
})
export class AppModule {}
