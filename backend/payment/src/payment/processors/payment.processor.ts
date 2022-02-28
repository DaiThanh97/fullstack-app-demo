import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { InjectRepository } from '@nestjs/typeorm';
import { randomPaymentResult } from 'src/utils/helpers/random';
import { PaymentPublisher } from '../events/payment.publisher';
import { PAYMENT_JOB, PAYMENT_QUEUE } from '../payment.constant';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentStatus } from '../types/payment.enum';

@Processor(PAYMENT_QUEUE)
export class PaymentProcessor {
  constructor(
    @InjectRepository(PaymentRepository)
    private readonly paymentRepository: PaymentRepository,
    private readonly paymentPublisher: PaymentPublisher,
  ) {}

  @Process(PAYMENT_JOB)
  async processPayment(job: Job<any>) {
    const result = randomPaymentResult();
    const status = result ? PaymentStatus.SUCCESS : PaymentStatus.FAILED;
    this.paymentRepository.updatePaymentStatus(job.data.orderId, status);

    // Publish payment result back to order service
    this.paymentPublisher.paymentProcess({
      orderId: job.data.orderId,
      success: result,
      paymentId: job.data.paymentId,
    });
  }
}
