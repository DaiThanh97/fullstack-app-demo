import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import cors from 'cors';
import { AppModule } from './app.module';
import { winstonFormat, winstonTransports } from './configs/syslog';
import { format, transports } from 'winston';
import {
  appendIdToRequest,
  appendRequestIdToLogger,
  LoggingInterceptor,
  NestjsWinstonLoggerService,
  RequestContext,
} from './utils/logger';
import {
  morganRequestLogger,
  morganResponseLogger,
} from './utils/logger/morgan';
import { requestContextMiddleware } from '@medibloc/nestjs-request-context';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT');
  const OPEN_PLAYGROUND = configService.get<boolean>('OPEN_PLAYGROUND');
  const LOG_LEVEL = configService.get<string>('LOG_LEVEL');
  const LOG_INLINE = configService.get<string>('LOG_INLINE');
  const NATS_HOST = configService.get<string>('NATS_HOST');
  const SERVICE_NAME = configService.get<string>('SERVICE_NAME');

  if (!LOG_INLINE) {
    winstonFormat.push(format.prettyPrint({ colorize: true }));
  }

  const globalLogger = new NestjsWinstonLoggerService(
    {
      level: LOG_LEVEL,
      format: format.combine(...winstonFormat),
      transports: winstonTransports,
      exceptionHandlers: new transports.Console(),
      exitOnError: false,
    },
    configService,
  );

  app.useLogger(globalLogger);

  app.use(
    cors(),
    morganRequestLogger(globalLogger),
    morganResponseLogger(globalLogger),
    requestContextMiddleware(RequestContext),
    appendIdToRequest,
    appendRequestIdToLogger(globalLogger),
    helmet({ ...(OPEN_PLAYGROUND && { contentSecurityPolicy: false }) }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor(globalLogger));

  // Initialize microservice communication
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.NATS,
      options: {
        servers: [NATS_HOST],
      },
    },
    {
      inheritAppConfig: true,
    },
  );

  await app.startAllMicroservices();
  await app
    .listen(PORT)
    .then(() => console.log(`🚀  ${SERVICE_NAME} is ready at ${PORT}`));
}
bootstrap();
