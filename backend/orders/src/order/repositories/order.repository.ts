import { LeanArray } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  LeanOrderDocument,
  Order,
  OrderDocument,
  LeanArrayOrderDocument,
} from '../schemas/order.schema';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async findOne(
    orderFilterQuery: FilterQuery<Order>,
    isLean: boolean = false,
  ): Promise<OrderDocument | LeanOrderDocument> {
    const order = this.orderModel.findOne(orderFilterQuery);
    return isLean ? order.lean() : order;
  }

  async findOrderById(
    orderFilterQuery: FilterQuery<Order>,
    isLean: boolean = false,
  ): Promise<LeanOrderDocument | OrderDocument> {
    const orders = this.orderModel.findOne(orderFilterQuery);
    return isLean ? orders.lean() : orders;
  }

  async find(
    orderFilterQuery: FilterQuery<Order>,
    isLean: boolean = false,
  ): Promise<LeanArrayOrderDocument | OrderDocument[]> {
    const orders = this.orderModel
      .find(orderFilterQuery)
      .sort({ createdAt: -1 });
    return isLean ? orders.lean() : orders;
  }

  async create(order: Partial<Order>): Promise<OrderDocument> {
    return this.orderModel.create(order);
  }

  async findByIdAndUpdate(
    orderId: string,
    update: Partial<Order>,
  ): Promise<OrderDocument> {
    return this.orderModel.findByIdAndUpdate(
      orderId,
      {
        $set: {
          ...update,
        },
      },
      {
        new: true,
      },
    );
  }
}
