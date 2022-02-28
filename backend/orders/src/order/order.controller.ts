import { Controller, Get, UseGuards } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { HeaderGuard } from 'src/common/guards/header.guard';
import { PAYMENT_PROCESS_EVENT } from './../common/events';
import { OrderService } from './order.service';
import { IPaymentProcessEvent } from './types/payment.type';

@Controller()
@UseGuards(HeaderGuard)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern(PAYMENT_PROCESS_EVENT)
  paymentProcessListener(data: IPaymentProcessEvent) {
    this.orderService.paymentProcessListener(data);
  }
}
