import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { EventPattern } from '@nestjs/microservices';
import { ORDER_CREATED_EVENT } from 'src/common/events';
import { HeaderGuard } from 'src/common/guards/header.guard';
import { PaymentService } from './payment.service';
import { IOrderCreatedEvent } from './types/order.types';

@Controller('/payment')
@UseGuards(HeaderGuard)
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @EventPattern(ORDER_CREATED_EVENT)
  orderCreatedListener(data: IOrderCreatedEvent) {
    this.paymentService.orderCreatedListener(data);
  }
}
