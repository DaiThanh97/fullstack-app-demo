
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */
export enum OrderStatus {
    CREATED = "CREATED",
    CONFIRMED = "CONFIRMED",
    DELIVERED = "DELIVERED",
    CANCELLED = "CANCELLED"
}

export class OrderCreateInput {
    amount: number;
    tax: number;
    total: number;
}

export class OrderCancelInput {
    orderId: string;
}

export class OrderByIdInput {
    orderId: string;
}

export class CheckOrderStatusInput {
    orderId: string;
}

export abstract class IMutation {
    abstract createOrder(input: OrderCreateInput): Nullable<OrderDetail> | Promise<Nullable<OrderDetail>>;

    abstract cancelOrder(input: OrderCancelInput): Nullable<OrderDetail> | Promise<Nullable<OrderDetail>>;
}

export abstract class IQuery {
    abstract order(input: OrderByIdInput): Nullable<OrderDetail> | Promise<Nullable<OrderDetail>>;

    abstract orders(): Nullable<Nullable<OrderDetail>[]> | Promise<Nullable<Nullable<OrderDetail>[]>>;

    abstract checkOrderStatus(input: CheckOrderStatusInput): Nullable<OrderStatusCheck> | Promise<Nullable<OrderStatusCheck>>;
}

export class OrderDetail {
    _id: string;
    paymentId: string;
    amount: number;
    tax: number;
    total: number;
    status: OrderStatus;
    createdAt?: Nullable<string>;
    updatedAt?: Nullable<string>;
    createdBy: string;
}

export class OrderStatusCheck {
    status: OrderStatus;
}

type Nullable<T> = T | null;
