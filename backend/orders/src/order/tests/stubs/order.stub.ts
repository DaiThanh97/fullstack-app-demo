import { OrderStatus } from './../../../graphql';
import { Order } from '../../schemas/order.schema';

export const orderStub = (): Order => ({
  paymentId: '123',
  amount: 1000,
  tax: 20,
  total: 20000,
  status: OrderStatus.CONFIRMED,
  createdBy: 'haha',
});
