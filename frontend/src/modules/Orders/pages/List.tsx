import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Stack from 'react-bootstrap/Stack';
import styled from 'styled-components';
import { useNavigate } from 'react-router';

import Loading from '../../../components/Loading';
import { useOrderListQuery } from '../hooks';
import { IOrder } from '../types';
import OrderCard from './../components/OrderCard';
import { useAppDispatch } from '../../../store/store';
import orderReducer from './../reducer';
import { RootState } from '../../../store/reducers';

const CreateButtonHolder = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
`;

const EmptyContent = styled.h5`
  margin-top: 50px;
`;

const OrderList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { orders } = useSelector((state: RootState) => state.order);
  const { loading, data: orderList } = useOrderListQuery({
    pollInterval: 5000,
  });

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(orderReducer.actions.updateList(orderList?.orders ?? []));
    }
  }, [orderList]);

  const generateOrders = useCallback(() => {
    return orders?.map((order: IOrder) => (
      <OrderCard
        key={order._id}
        orderId={order._id}
        amount={order.amount}
        tax={order.tax}
        total={order.total}
        status={order.status}
      />
    ));
  }, [orders]);

  const onClickCreate = useCallback(() => {
    navigate('/orders/create');
  }, []);

  return (
    <>
      {loading ? (
        <Loading width="100" />
      ) : (
        <>
          <CreateButtonHolder>
            <Button variant="primary" onClick={onClickCreate}>
              Create
              <i className="fa-solid fa-plus" style={{ marginLeft: '5px' }}></i>
            </Button>
          </CreateButtonHolder>
          {orderList ? (
            <Stack gap={3}>{generateOrders()}</Stack>
          ) : (
            <EmptyContent>Empty...</EmptyContent>
          )}
        </>
      )}
    </>
  );
};

export default OrderList;
