import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ICancelOrderAction,
  ICreateOrderAction,
  IOrder,
  OrderStatus,
} from './types';

export interface OrderState {
  orders: IOrder[];
}

const initState: OrderState = {
  orders: [],
};

const orderSlice = createSlice({
  name: 'orders',
  initialState: initState,
  reducers: {
    updateList: (state: OrderState, action: PayloadAction<IOrder[]>) => {
      state.orders = action.payload;
    },
    appendList: (
      state: OrderState,
      action: PayloadAction<ICreateOrderAction>,
    ) => {
      if (action.payload.order) {
        state.orders.unshift(action.payload.order);
      }
    },
    cancelOrder: (
      state: OrderState,
      action: PayloadAction<ICancelOrderAction>,
    ) => {
      const order = state.orders.find(
        (order) => order._id === action.payload.orderId,
      );
      if (order) {
        order.status = OrderStatus.CANCELLED;
      }
    },
  },
});

export const { actions, reducer } = orderSlice;

export default orderSlice;
