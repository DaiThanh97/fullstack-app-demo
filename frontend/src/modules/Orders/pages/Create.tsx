import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import { ICreateOrderInput } from '../types';
import { useCreateOrderMutation } from '../hooks';
import { showErrorToast, showSuccessToast } from '../../../libs/toast';
import { useAppDispatch } from '../../../store/store';
import orderReducer from '../reducer';

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

const initialValues: ICreateOrderInput = {
  amount: 0,
  tax: 0,
  total: 0,
};

const schema = Yup.object().shape({
  amount: Yup.number()
    .min(1, 'Amount must greater than 0')
    .required('Amount is required!'),
  tax: Yup.number()
    .min(1, 'Tax must greater than 0')
    .required('Tax is required!'),
  total: Yup.number()
    .min(1, 'Total must greater than 0')
    .required('Total is required!'),
});

const Create: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [createOrder, { loading }] = useCreateOrderMutation();

  const { values, errors, handleSubmit, handleChange } = useFormik({
    initialValues,
    validationSchema: schema,
    onSubmit: async (values: ICreateOrderInput) => {
      try {
        const result = await createOrder({
          variables: {
            input: {
              amount: values.amount,
              tax: values.tax,
              total: values.total,
            },
          },
        });

        const success = result.data?.createOrder || result.errors;
        if (success) {
          dispatch(
            orderReducer.actions.appendList({
              order: result.data?.createOrder,
            }),
          );
          onClickBack();
          showSuccessToast(`Create order successfully!`);
        } else {
          showErrorToast(`Something went wrong when create order!`);
        }
      } catch (err) {
        console.log(err);
        showErrorToast(`Something went wrong when create order!`);
      }
    },
  });

  const onClickBack = useCallback(() => {
    navigate(`/orders`);
  }, [navigate]);

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <CardHolder>
          <Card.Body>
            <CardTitle>CREATE ORDER</CardTitle>
            <Card.Text>
              <Form.Group>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="amount"
                  value={values.amount}
                  onChange={handleChange}
                  isInvalid={!!errors.amount}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Tax</Form.Label>
                <Form.Control
                  type="number"
                  name="tax"
                  value={values.tax}
                  onChange={handleChange}
                  isInvalid={!!errors.tax}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tax}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label>Total</Form.Label>
                <Form.Control
                  type="number"
                  name="total"
                  value={values.total}
                  onChange={handleChange}
                  isInvalid={!!errors.total}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.total}
                </Form.Control.Feedback>
              </Form.Group>
            </Card.Text>
          </Card.Body>
        </CardHolder>
        <BackButtonHolder>
          <Button className="w-100" onClick={onClickBack}>
            Back
          </Button>
          <Button
            type="submit"
            disabled={loading}
            variant="info"
            className="w-100"
          >
            {loading ? (
              <Spinner animation="border" variant="light" />
            ) : (
              'Create'
            )}
          </Button>
        </BackButtonHolder>
      </Form>
    </>
  );
};

export default Create;
