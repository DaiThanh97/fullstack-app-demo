import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { formatCurrency } from '../../../utils/formatter';
import { OrderStatus } from '../types';

const CardContainer = styled(Card)<{ status: OrderStatus }>`
  border-radius: 20px;
  transition: 0.4s;
  background-color: ${(props) =>
    props.status === OrderStatus.CANCELLED ? '#dc3545' : '#ffffff'};
  &:hover {
    background-color: ${(props) =>
      props.status === OrderStatus.CANCELLED ? '#dc3545' : '#dfdfdfdf'};
  }
`;

const OrderCardContent = styled(Card.Text)`
  display: flex;
  justify-content: space-between;
`;

const InfoButton = styled(Button)`
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: white;
`;

export interface IOrderCardProps {
  orderId: string;
  amount: number;
  tax: number;
  total: number;
  status: OrderStatus;
}

const OrderCard: React.FC<IOrderCardProps> = ({
  orderId,
  amount,
  tax,
  total,
  status,
}: IOrderCardProps) => {
  const navigate = useNavigate();

  const onClickInfo = () => {
    navigate(`/orders/info/${orderId}`);
  };

  return (
    <CardContainer status={status}>
      <Card.Body>
        <Card.Title>Order #{orderId}</Card.Title>
        <OrderCardContent>
          <div>
            <div>Amount: {formatCurrency(amount)}</div>
            <div>Tax: {tax}</div>
            <div>Total: {formatCurrency(total)}</div>
          </div>
          <div>
            <InfoButton variant="secondary" onClick={onClickInfo}>
              <i className="fa-solid fa-info"></i>
            </InfoButton>
          </div>
        </OrderCardContent>
      </Card.Body>
    </CardContainer>
  );
};

export default OrderCard;
