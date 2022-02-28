import { Request, Response, NextFunction } from 'express';
import { NestjsWinstonLoggerService } from './nestjs-winston-logger.service';
import { v4 as uuidv4 } from 'uuid';
import { RequestContext as BaseRequestContext } from '@medibloc/nestjs-request-context';

export class RequestContext extends BaseRequestContext {
  requestId!: string;
  context!: string;
}

export const appendIdToRequest = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (!req.headers['request-id'] || req.headers['request-id'] === 'undefined') {
    const uuid = uuidv4();
    req.headers['request-id'] = uuid;
  }
  next();
};

export const appendRequestIdToLogger =
  (logger: NestjsWinstonLoggerService) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const ctx = RequestContext.get<RequestContext>();
    const requestId = req.headers?.['request-id'] as string;
    logger.appendDefaultMeta('request-id', requestId);
    ctx.requestId = requestId;

    if (req.headers?.['context'] && req.headers?.['context'] !== 'undefined') {
      const context = req.headers?.['context'] as string;
      ctx.context = context;
    }
    next();
  };
