import morgan from 'morgan';
import { RequestHandler, Request, Response } from 'express';
import { MORGAN_FORMAT_STRING } from './morgan.constants';
import { NestjsWinstonLoggerService } from '../nestjs-winston-logger.service';

export const morganRequestLogger = (
  logger: NestjsWinstonLoggerService,
  morganFormatString: string = MORGAN_FORMAT_STRING.REQUEST,
): RequestHandler<Request, Response> =>
  morgan(morganFormatString, {
    immediate: true,
    stream: {
      write: (message: string) => {
        logger.log(message.replace('\n', ''));
      },
    },
  });

export const morganResponseLogger = (
  logger: NestjsWinstonLoggerService,
  morganFormatString: string = MORGAN_FORMAT_STRING.RESPONSE,
): RequestHandler<Request, Response> =>
  morgan(morganFormatString, {
    stream: {
      write: (message: string) => {
        logger.log(message.replace('\n', ''));
      },
    },
  });
