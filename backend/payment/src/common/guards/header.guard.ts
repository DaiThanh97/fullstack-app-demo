import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NatsContext } from '@nestjs/microservices';
import { ForbiddenError } from '../errors';

@Injectable()
export class HeaderGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const natsCtx = context.switchToRpc().getContext<NatsContext>();
    const headerKey = natsCtx?.getHeaders()?.get('internalKey') ?? '';
    const internalKey = this.configService.get<string>('INTERNAL_KEY');

    if (headerKey !== internalKey) {
      throw new ForbiddenError('Communicate forbidden!');
    }
    return true;
  }
}
