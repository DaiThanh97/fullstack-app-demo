import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NestjsWinstonLoggerService } from './nestjs-winston-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: NestjsWinstonLoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    this.logger.setContext(context.getClass().name);
    return next.handle().pipe(
      tap({
        next: (value) => {
          this.logger.log(`[DATA]: ${JSON.stringify(value)}`);
        },
        error: (err) => {
          this.logger.error(err, '');
        },
      }),
    );
  }
}
