import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CreateOrderDto } from './dtos/create-order.dto';
import {
  LeanArrayOrderDocument,
  LeanOrderDocument,
  OrderDocument,
} from './schemas/order.schema';
import { CancelOrderDto } from './dtos/cancel-order.dto';
import { OrderStatus } from './../graphql';
import { CheckOrderStatusDto } from './dtos/check-order-status.dto';
import { NotFoundError } from '../common/errors';
import { OrderPublisher } from './events/order.publisher';
import { IPaymentProcessEvent } from './types/payment.type';
import { DELIVERY_JOB, DELIVERY_QUEUE } from './order.constant';
import { OrderRepository } from './repositories/order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderPublisher: OrderPublisher,
    private readonly orderRepository: OrderRepository,
    @InjectQueue(DELIVERY_QUEUE) private deliveryQueue: Queue,
  ) {}

  async createOrder(
    input: CreateOrderDto,
    userId: string,
  ): Promise<OrderDocument> {
    const order = await this.orderRepository.create({
      amount: input.amount,
      tax: input.tax,
      total: input.total,
      createdBy: userId,
    });

    // Publish message to payment service
    this.orderPublisher.createOrder({
      orderId: order._id,
      amount: order.amount,
      tax: order.tax,
      total: order.total,
    });
    return order;
  }

  async cancelOrder(
    input: CancelOrderDto,
    userId: string,
  ): Promise<OrderDocument> {
    const orderFound = await this.orderRepository.findOne({
      _id: input.orderId,
      createdBy: userId,
    });

    if (!orderFound) {
      throw new NotFoundError(
        `Order with id ${input.orderId} created by ${userId} not found!`,
      );
    }

    return this.orderRepository.findByIdAndUpdate(input.orderId, {
      status: OrderStatus.CANCELLED,
    });
  }

  async checkOrderStatus(
    input: CheckOrderStatusDto,
    userId: string,
  ): Promise<LeanOrderDocument> {
    const found = await this.orderRepository.findOne(
      {
        _id: input.orderId,
        createdBy: userId,
      },
      true,
    );

    if (!found) {
      throw new NotFoundError(
        `Order with id ${input.orderId} created by ${userId} not found!`,
      );
    }
    return found;
  }

  async all(userId: string): Promise<LeanArrayOrderDocument> {
    return this.orderRepository.find({ createdBy: userId });
  }

  async orderById(orderId: string, userId: string): Promise<LeanOrderDocument> {
    return this.orderRepository.findOrderById(
      { _id: orderId, createdBy: userId },
      true,
    );
  }

  async paymentProcessListener(data: IPaymentProcessEvent): Promise<void> {
    const status = data.success ? OrderStatus.CONFIRMED : OrderStatus.CANCELLED;
    await this.orderRepository.findByIdAndUpdate(data.orderId, {
      status,
      paymentId: data.paymentId,
    });

    // Fake job delivery process if payment success
    if (status === OrderStatus.CONFIRMED) {
      this.deliveryQueue.add(
        DELIVERY_JOB,
        { orderId: data.orderId },
        { delay: 10000 },
      );
    }
  }
}
