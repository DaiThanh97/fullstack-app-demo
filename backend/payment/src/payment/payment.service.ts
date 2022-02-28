import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { PaymentRepository } from './repositories/payment.repository';
import { OrderRepository } from './repositories/order.repository';
import { IOrderCreatedEvent } from './types/order.types';
import { PAYMENT_JOB, PAYMENT_QUEUE } from './payment.constant';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(PaymentRepository)
    private readonly paymentRepository: PaymentRepository,
    @InjectRepository(OrderRepository)
    private readonly orderRepository: OrderRepository,
    @InjectQueue(PAYMENT_QUEUE) private paymentQueue: Queue,
  ) {}

  async orderCreatedListener(data: IOrderCreatedEvent) {
    const [paymentResult, _] = await Promise.all([
      this.paymentRepository.createPayment(data.orderId),
      this.orderRepository.createOrder(data),
    ]);

    // Fake job process payment
    await this.paymentQueue.add(
      PAYMENT_JOB,
      { orderId: data.orderId, paymentId: paymentResult.id.toString() },
      {
        delay: 5000, // Take 5s to process payment
      },
    );
  }
}
