import { EntityRepository, Repository, UpdateResult } from 'typeorm';
import { PaymentEntity } from '../entities/payment.entity';
import { PaymentStatus } from '../types/payment.enum';

@EntityRepository(PaymentEntity)
export class PaymentRepository extends Repository<PaymentEntity> {
  async createPayment(orderId: string): Promise<PaymentEntity> {
    const payment = this.create({
      orderId,
    });

    await this.save(payment);
    return payment;
  }

  async updatePaymentStatus(
    orderId: string,
    status: PaymentStatus,
  ): Promise<UpdateResult> {
    return this.update({ orderId }, { status });
  }
}
