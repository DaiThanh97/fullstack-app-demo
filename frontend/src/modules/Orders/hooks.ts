import { gql, QueryHookOptions, useMutation, useQuery } from '@apollo/client';
import {
  IOrderListQueryResult,
  IOrderInfoQueryResult,
  ICancelOrderMutationResult,
  ICreateOrderMutationResult,
  IOrderInfoVars,
  ICancelOrderVars,
  ICreateOrderVars,
} from './types';

const GET_ORDER_LIST = gql`
  query Orders {
    orders {
      _id
      paymentId
      amount
      tax
      total
      status
      createdAt
      updatedAt
      createdBy
    }
  }
`;

const GET_ORDER_INFO = gql`
  query Order($input: OrderByIdInput!) {
    order(input: $input) {
      _id
      paymentId
      amount
      tax
      total
      status
      createdAt
      updatedAt
      createdBy
    }
  }
`;

const CANCEL_ORDER = gql`
  mutation CancelOrder($input: OrderCancelInput!) {
    cancelOrder(input: $input) {
      _id
      paymentId
      amount
      tax
      total
      status
      createdAt
      updatedAt
      createdBy
    }
  }
`;

const CREATE_ORDER = gql`
  mutation CreateOrder($input: OrderCreateInput!) {
    createOrder(input: $input) {
      _id
      amount
      createdAt
      createdBy
      paymentId
      status
      tax
      total
      updatedAt
    }
  }
`;

export const useOrderListQuery = (
  options: QueryHookOptions<IOrderListQueryResult>,
) => useQuery<IOrderListQueryResult>(GET_ORDER_LIST, options);

export const useOrderInfoQuery = (
  options: QueryHookOptions<IOrderInfoQueryResult, IOrderInfoVars>,
) => useQuery<IOrderInfoQueryResult, IOrderInfoVars>(GET_ORDER_INFO, options);

export const useCancelOrderMutation = () =>
  useMutation<ICancelOrderMutationResult, ICancelOrderVars>(CANCEL_ORDER);

export const useCreateOrderMutation = () =>
  useMutation<ICreateOrderMutationResult, ICreateOrderVars>(CREATE_ORDER);
