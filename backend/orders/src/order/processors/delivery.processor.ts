import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { DELIVERY_QUEUE, DELIVERY_JOB } from '../order.constant';
import { Order, OrderDocument } from '../schemas/order.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { OrderStatus } from './../../graphql';

@Processor(DELIVERY_QUEUE)
export class DeliveryProcessor {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  @Process(DELIVERY_JOB)
  async processDelivery(job: Job<any>) {
    const orderId = job.data.orderId;
    await this.orderModel.findByIdAndUpdate(orderId, {
      $set: {
        status: OrderStatus.DELIVERED,
      },
    });
  }
}
