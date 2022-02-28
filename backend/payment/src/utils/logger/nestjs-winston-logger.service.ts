import { Inject, Injectable, ConsoleLogger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createLogger, LoggerOptions, Logger as WinstonLogger } from 'winston';
import { NESTJS_WINSTON_CONFIG_OPTIONS } from './nestjs-winston-logger.constants';

@Injectable({ scope: Scope.TRANSIENT })
export class NestjsWinstonLoggerService extends ConsoleLogger {
  private logger: WinstonLogger;

  constructor(
    @Inject(NESTJS_WINSTON_CONFIG_OPTIONS) config: LoggerOptions,
    private readonly configService: ConfigService,
  ) {
    super();
    this.logger = createLogger(config);
    this.appendDefaultMeta(
      'service',
      this.configService.get<string>('LOG_SERVICE_NAME') as string,
    );
  }

  appendDefaultMeta(key: string, value: string): void {
    this.logger.defaultMeta = {
      ...this.logger.defaultMeta,
      [key]: value,
    };
  }

  log(message: string, caller?: string): void {
    const logDetails: Record<string, unknown> = { message };
    if (caller) {
      logDetails.caller = caller;
    }
    this.logger.info(logDetails);
  }

  error(error: Error | string, caller?: string): void {
    const logDetails: Record<string, unknown> = {
      message: (error as Error)?.message ?? error,
    };
    if (caller) {
      logDetails.caller = caller;
    }
    if ((error as Error)?.stack) {
      logDetails.trace = (error as Error)?.stack?.trim();
    }
    this.logger.error(logDetails);
  }

  warn(message: string, caller?: string): void {
    const logDetails: Record<string, unknown> = { message };
    if (caller) {
      logDetails.caller = caller;
    }
    this.logger.warn(logDetails);
  }

  debug(message: string, caller?: string): void {
    const logDetails: Record<string, unknown> = { message };
    if (caller) {
      logDetails.caller = caller;
    }
    this.logger.debug(logDetails);
  }

  verbose(message: string, caller?: string): void {
    const logDetails: Record<string, unknown> = { message };
    if (caller) {
      logDetails.caller = caller;
    }
    this.logger.verbose(logDetails);
  }
}
