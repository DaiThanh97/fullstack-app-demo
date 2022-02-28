import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { NatsContext } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { NestjsWinstonLoggerService } from './nestjs-winston-logger.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: NestjsWinstonLoggerService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const caller = context.getClass().name + '.' + context.getHandler().name;
    return next.handle().pipe(
      tap({
        next: (value) => {
          let data = '';
          if (value) {
            data = JSON.stringify(value);
          } else {
            const natsCtx = context.switchToRpc().getContext<NatsContext>();
            const callingService = natsCtx.getHeaders()?.get('publisher') ?? '';
            const microMsg = {
              source: callingService,
              data: context.switchToRpc().getData(),
            };
            data = JSON.stringify(microMsg);
          }
          this.logger.log(data, caller);
        },
        error: (err) => {
          this.logger.error(err, caller);
        },
      }),
    );
  }
}
