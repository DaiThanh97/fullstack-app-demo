export interface IOrderCreatedEvent {
  orderId: string;
  amount: number;
  tax: number;
  total: number;
}
