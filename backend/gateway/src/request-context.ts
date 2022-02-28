import { RequestContext as BaseRequestContext } from '@medibloc/nestjs-request-context';

export class RequestContext extends BaseRequestContext {
  requestId!: string;
  context!: string;
}
