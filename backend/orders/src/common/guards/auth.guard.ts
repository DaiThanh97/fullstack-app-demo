import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthenticationError } from '../errors';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = GqlExecutionContext.create(context).getContext();
    const authorization = ctx.headers.authorization;
    if (!authorization) {
      throw new AuthenticationError('Authentication failed!');
    }
    ctx.userId = authorization;
    return true;
  }
}
