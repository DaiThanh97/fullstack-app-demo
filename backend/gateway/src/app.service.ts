import {
  INestApplication,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
  OnModuleDestroy,
  OnModuleInit,
  BeforeApplicationShutdown,
} from '@nestjs/common';
import { bootstrap } from './main';

@Injectable()
export class AppService
  implements
    OnApplicationBootstrap,
    OnApplicationShutdown,
    OnModuleDestroy,
    OnModuleInit,
    BeforeApplicationShutdown
{
  private readonly logger = new Logger();
  private _app!: INestApplication;

  get app(): INestApplication {
    return this._app;
  }

  set app(value: INestApplication) {
    this._app = value;
  }

  onModuleInit(): void {
    this.logger.log('onModuleInit');
  }

  onApplicationBootstrap(): void {
    this.logger.log('onApplicationBootstrap');
  }

  onModuleDestroy(): void {
    this.logger.log('onModuleDestroy');
  }

  beforeApplicationShutdown(): void {
    this.logger.log('beforeApplicationShutdown');
  }

  onApplicationShutdown(): void {
    this.logger.log(`onApplicationShutdown`);
    bootstrap();
  }
}
