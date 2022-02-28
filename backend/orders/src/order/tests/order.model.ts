import { Order } from '../schemas/order.schema';
import { orderStub } from './stubs/order.stub';

export abstract class MockModel<T> {
  protected abstract entityStub: T;

  constructor(createEntityData: T) {
    this.constructorSpy(createEntityData);
  }

  constructorSpy(_createEntityData: T): void {}

  async findOne(): Promise<T> {
    return this.entityStub;
  }

  async find(): Promise<T[]> {
    return [this.entityStub];
  }

  async create(): Promise<T> {
    return this.entityStub;
  }

  async findByIdAndUpdate(): Promise<T> {
    return this.entityStub;
  }
}

export class OrderModel extends MockModel<Order> {
  protected entityStub = orderStub();
}
