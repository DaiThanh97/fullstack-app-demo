import { Catch, ArgumentsHost } from '@nestjs/common';
import { CommonError } from 'src/common/errors';

@Catch()
export class AllExceptionFilter {
  catch(error: Error, host: ArgumentsHost) {
    const gqlError = error as CommonError;
  }
}
