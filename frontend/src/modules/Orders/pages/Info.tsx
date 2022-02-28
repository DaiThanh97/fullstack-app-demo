import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import { OrderStatus } from '../types';
import { formatCurrency, formatDateTime } from '../../../utils/formatter';
import { useCancelOrderMutation, useOrderInfoQuery } from '../hooks';
import Loading from '../../../components/Loading';
import { showErrorToast, showSuccessToast } from '../../../libs/toast';
import { useAppDispatch } from '../../../store/store';
import orderReducer from './../reducer';

const CardHolder = styled(Card)`
  border-radius: 20px;
`;

const CardTitle = styled(Card.Title)`
  margin-bottom: 30px;
`;

const BackButtonHolder = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Info: React.FC = () => {
  const { orderId = '' } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [cancelOrder, { loading: loadingCancel }] = useCancelOrderMutation();
  const {
    loading: loadingInfo,
    data,
    refetch,
  } = useOrderInfoQuery({
    fetchPolicy: 'cache-and-network',
    variables: {
      input: {
        orderId,
      },
    },
  });

  const generateStatus = useCallback((status?: OrderStatus) => {
    let background = 'primary';
    switch (status) {
      case OrderStatus.CREATED:
        background = 'secondary';
        break;
      case OrderStatus.CONFIRMED:
        background = 'success';
        break;
      case OrderStatus.CANCELLED:
        background = 'danger';
        break;
      case OrderStatus.DELIVERED:
        background = 'info';
        break;
      default:
        background = 'primary';
        break;
    }
    return <Badge bg={background}>{status}</Badge>;
  }, []);

  const onClickBack = useCallback(() => {
    navigate(`/orders`);
  }, [navigate]);

  const onClickCancel = async () => {
    try {
      const result = await cancelOrder({
        variables: {
          input: {
            orderId,
          },
        },
      });

      const success = result.data?.cancelOrder || result.errors;
      if (success) {
        dispatch(
          orderReducer.actions.cancelOrder({
            orderId,
          }),
        );
        refetch();
        showSuccessToast(`Cancel order ${orderId} successfully!`);
      } else {
        showErrorToast(`Something went wrong when cancel order ${orderId}!`);
      }
    } catch (err) {
      console.log(err);
      showErrorToast(`Something went wrong when cancel order ${orderId}!`);
    }
  };

  return (
    <>
      {loadingInfo ? (
        <Loading width="100" />
      ) : (
        <>
          <CardHolder>
            <Card.Body>
              <CardTitle>#{orderId}</CardTitle>
              <Card.Text>
                <Container>
                  <Row>
                    <Col md={2}>Amount:</Col>
                    <Col md={10}>{formatCurrency(data?.order.amount)}</Col>
                  </Row>
                  <Row>
                    <Col md={2}>Tax:</Col>
                    <Col md={10}>{data?.order.tax}</Col>
                  </Row>
                  <Row>
                    <Col md={2}>Total:</Col>
                    <Col md={10}>{formatCurrency(data?.order.total)}</Col>
                  </Row>
                  <Row>
                    <Col md={2}>Status:</Col>
                    <Col md={10}>{generateStatus(data?.order.status)}</Col>
                  </Row>
                  <Row>
                    <Col md={2}>Payment ID:</Col>
                    <Col md={10}>{data?.order.paymentId}</Col>
                  </Row>
                  <Row>
                    <Col md={2}>Created Date:</Col>
                    <Col md={10}>{formatDateTime(data?.order.createdAt)}</Col>
                  </Row>
                </Container>
              </Card.Text>
            </Card.Body>
          </CardHolder>
          <BackButtonHolder>
            <Button className="w-100" onClick={onClickBack}>
              Back
            </Button>
            {data?.order.status === OrderStatus.CANCELLED ? (
              ''
            ) : (
              <Button
                variant="danger"
                className="w-100"
                disabled={loadingCancel}
                onClick={onClickCancel}
              >
                {loadingCancel ? (
                  <Spinner animation="border" variant="light" />
                ) : (
                  'Cancel'
                )}
              </Button>
            )}
          </BackButtonHolder>
        </>
      )}
    </>
  );
};

export default Info;
