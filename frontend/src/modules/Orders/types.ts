export interface IOrderListQueryResult {
  orders: IOrder[];
}

export interface IOrderInfoQueryResult {
  order: IOrder;
}

export interface ICancelOrderMutationResult {
  cancelOrder: IOrder;
}

export interface ICreateOrderMutationResult {
  createOrder: IOrder;
}

export interface ICancelOrderAction {
  orderId: string;
}

export interface ICreateOrderAction {
  order?: IOrder;
}

export interface ICreateOrderInput {
  amount: number;
  tax: number;
  total: number;
}

export interface IOrderInfoVars {
  input: {
    orderId: string;
  };
}

export interface ICancelOrderVars {
  input: {
    orderId: string;
  };
}

export interface ICreateOrderVars {
  input: {
    amount: number;
    tax: number;
    total: number;
  };
}

export interface IOrder {
  _id: string;
  paymentId: string;
  amount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export enum OrderStatus {
  CREATED = 'CREATED',
  CONFIRMED = 'CONFIRMED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
