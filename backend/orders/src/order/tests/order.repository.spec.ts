import { getModelToken } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';
import { FilterQuery } from 'mongoose';
import { Order } from '../schemas/order.schema';
import { OrderRepository } from '../repositories/order.repository';
import { orderStub } from './stubs/order.stub';
import { OrderModel } from './order.model';

describe('OrderRepository', () => {
  let orderRepository: OrderRepository;

  describe('find operations', () => {
    let orderModel: OrderModel;
    let orderFilterQuery: FilterQuery<Order>;

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          OrderRepository,
          {
            provide: getModelToken(Order.name),
            useClass: OrderModel,
          },
        ],
      }).compile();

      orderRepository = moduleRef.get<OrderRepository>(OrderRepository);
      orderModel = moduleRef.get<OrderModel>(getModelToken(Order.name));

      orderFilterQuery = {
        createdBy: orderStub().createdBy,
      };

      jest.clearAllMocks();
    });

    describe('findOne', () => {
      describe('when findOne is called', () => {
        let order: Order;

        beforeEach(async () => {
          jest.spyOn(orderModel, 'findOne');
          order = await orderRepository.findOne(orderFilterQuery);
        });

        test('then it should call the orderModel', () => {
          expect(orderModel.findOne).toHaveBeenCalledWith(orderFilterQuery);
        });

        test('then it should return an order', () => {
          expect(order).toEqual(orderStub());
        });
      });
    });

    describe('find', () => {
      describe('when find is called', () => {
        let orders: Order[];

        beforeEach(async () => {
          jest.spyOn(orderModel, 'find');
          orders = await orderRepository.find(orderFilterQuery);
        });

        test('then it should call the userModel', () => {
          expect(orderModel.find).toHaveBeenCalledWith(orderFilterQuery);
        });

        test('then it should return a user', () => {
          expect(orders).toEqual([orderStub()]);
        });
      });
    });

    describe('findByIdAndUpdate', () => {
      describe('when findByIdAndUpdate is called', () => {
        let order: Order;
        const dummyId = '123abc';

        beforeEach(async () => {
          jest.spyOn(orderModel, 'findByIdAndUpdate');
          order = await orderRepository.findByIdAndUpdate(dummyId, orderStub());
        });

        test('then it should call the orderModel', () => {
          expect(orderModel.findByIdAndUpdate).toHaveBeenCalledWith(
            dummyId,
            {
              $set: {
                ...orderStub(),
              },
            },
            { new: true },
          );
        });

        test('then it should return an order', () => {
          expect(order).toEqual(orderStub());
        });
      });
    });
  });

  describe('create operations', () => {
    let orderModel: OrderModel;
    let orderFilterQuery: FilterQuery<Order>;

    beforeEach(async () => {
      const moduleRef = await Test.createTestingModule({
        providers: [
          OrderRepository,
          {
            provide: getModelToken(Order.name),
            useClass: OrderModel,
          },
        ],
      }).compile();

      orderRepository = moduleRef.get<OrderRepository>(OrderRepository);
      orderModel = moduleRef.get<OrderModel>(getModelToken(Order.name));

      orderFilterQuery = {
        createdBy: orderStub().createdBy,
      };

      jest.clearAllMocks();
    });

    describe('create', () => {
      describe('when create is called', () => {
        let order: Order;

        beforeEach(async () => {
          jest.spyOn(orderModel, 'create');
          order = await orderRepository.create(orderStub());
        });

        test('then it should call the orderModel', () => {
          expect(orderModel.create).toHaveBeenCalled();
        });

        test('then it should return an order', () => {
          expect(order).toEqual(orderStub());
        });
      });
    });
  });
});
