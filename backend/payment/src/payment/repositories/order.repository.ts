import { EntityRepository, Repository } from 'typeorm';
import { OrderEntity } from '../entities/order.entity';
import { IOrderCreatedEvent } from '../types/order.types';

@EntityRepository(OrderEntity)
export class OrderRepository extends Repository<OrderEntity> {
  async createOrder(order: IOrderCreatedEvent): Promise<OrderEntity> {
    const orderCreated = this.create({
      ...order,
    });

    await this.save(orderCreated);
    return orderCreated;
  }
}
