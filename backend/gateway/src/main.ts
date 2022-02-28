import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import cors from 'cors';
import { AppModule } from './app.module';
import {
  appendIdToRequest,
  appendRequestIdToLogger,
  LoggingInterceptor,
  NestjsWinstonLoggerService,
} from './utils/logger';
import { format, transports } from 'winston';
import { winstonFormat, winstonTransports } from './configs/syslog';
import { ConfigService } from '@nestjs/config';
import { requestContextMiddleware } from '@medibloc/nestjs-request-context';
import { RequestContext } from './request-context';
import {
  morganRequestLogger,
  morganResponseLogger,
} from './utils/logger/morgan';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') as number;
  const SERVICE_NAME = configService.get<string>('SERVICE_NAME');
  const LOG_LEVEL = configService.get<string>('LOG_LEVEL');
  const LOG_INLINE = configService.get<boolean>('LOG_INLINE');

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
    helmet(),
  );
  app.useGlobalInterceptors(new LoggingInterceptor(globalLogger));

  await app
    .listen(PORT)
    .then(() => console.log(`🚀 ${SERVICE_NAME} ready at ${PORT}`));
}
bootstrap();
