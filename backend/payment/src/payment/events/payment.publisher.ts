import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { PAYMENT_PROCESS_EVENT } from './../../common/events';
import { PAYMENT_SERVICE } from '../payment.constant';
import { IPaymentProcessEvent } from '../types/payment.type';

@Injectable()
export class PaymentPublisher {
  constructor(@Inject(PAYMENT_SERVICE) private readonly client: ClientProxy) {}

  paymentProcess(data: IPaymentProcessEvent): Observable<string> {
    return this.client.emit<string, IPaymentProcessEvent>(
      PAYMENT_PROCESS_EVENT,
      data,
    );
  }
}
