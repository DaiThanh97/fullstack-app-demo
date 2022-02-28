import { Controller, Get } from '@nestjs/common';

@Controller('/gateway')
export class AppController {
  @Get('/test')
  hello() {
    return 'Hello from Gateway!';
  }
}
