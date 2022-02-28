import { Test, TestingModule } from '@nestjs/testing';
import { getQueueToken } from '@nestjs/bull';
import { Order } from './../schemas/order.schema';
import { OrderService } from './../order.service';
import { OrderRepository } from '../repositories/order.repository';
import { OrderPublisher } from '../events/order.publisher';
import { DeliveryProcessor } from '../processors/delivery.processor';
import { CreateOrderDto } from '../dtos/create-order.dto';
import { CancelOrderDto } from '../dtos/cancel-order.dto';
import { OrderStatus } from './../../graphql';
import { CheckOrderStatusDto } from '../dtos/check-order-status.dto';

jest.mock('./../repositories/order.repository');

type MockType<T> = {
  [P in keyof T]?: jest.Mock<{}>;
};

describe('OrderService', () => {
  let service: OrderService;

  const orderRepositoryMock: MockType<OrderRepository> = {
    create: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  };

  const orderQueueMock: MockType<DeliveryProcessor> = {
    processDelivery: jest.fn(),
  };

  const orderPublisherMock: MockType<OrderPublisher> = {
    createOrder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        OrderRepository,
        {
          provide: OrderPublisher,
          useValue: orderPublisherMock,
        },
        {
          provide: getQueueToken('DELIVERY_QUEUE'),
          useValue: orderQueueMock,
        },
        {
          provide: OrderRepository,
          useValue: orderRepositoryMock,
        },
      ],
    }).compile();
    service = module.get<OrderService>(OrderService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order', async () => {
      const userId = 'dummyUserId';
      const createOrderDTO: CreateOrderDto = {
        amount: 10000,
        tax: 10,
        total: 20000,
      };

      orderRepositoryMock.create.mockResolvedValue(createOrderDTO as never);
      const order = await service.createOrder(createOrderDTO, userId);
      expect(orderRepositoryMock.create).toHaveBeenCalledWith({
        ...createOrderDTO,
        createdBy: userId,
      });
      expect(orderRepositoryMock.create).toHaveBeenCalledTimes(1);
      expect(orderPublisherMock.createOrder).toHaveBeenCalledTimes(1);
      expect(order).toEqual(createOrderDTO);
    });
  });

  describe('create order', () => {
    it('should create a new order', async () => {
      const userId = 'dummyUserId';
      const createOrderDTO: CreateOrderDto = {
        amount: 10000,
        tax: 10,
        total: 20000,
      };

      orderRepositoryMock.create.mockResolvedValue(createOrderDTO as never);
      const order = await service.createOrder(createOrderDTO, userId);
      expect(orderRepositoryMock.create).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.create).toHaveBeenCalledWith({
        ...createOrderDTO,
        createdBy: userId,
      });
      expect(orderPublisherMock.createOrder).toHaveBeenCalledTimes(1);
      expect(order).toEqual(createOrderDTO);
    });
  });

  describe('cancel order', () => {
    it('should change status to cancel', async () => {
      const userId = 'dummyUserId';
      const cancelOrderDTO: CancelOrderDto = {
        orderId: 'dummy',
      };

      const foundOrderMock: Order = {
        amount: 10000,
        createdBy: userId,
        paymentId: '',
        status: OrderStatus.CREATED,
        tax: 10,
        total: 20000,
      };

      const orderUpdateQuery = {
        status: OrderStatus.CANCELLED,
      };

      orderRepositoryMock.findOne.mockResolvedValue(foundOrderMock as never);
      orderRepositoryMock.findByIdAndUpdate.mockResolvedValue({
        ...foundOrderMock,
        status: OrderStatus.CANCELLED,
      } as never);
      const order = await service.cancelOrder(cancelOrderDTO, userId);
      expect(orderRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.findOne).toHaveBeenCalledWith({
        _id: cancelOrderDTO.orderId,
        createdBy: userId,
      });
      expect(orderRepositoryMock.findByIdAndUpdate).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.findByIdAndUpdate).toHaveBeenCalledWith(
        cancelOrderDTO.orderId,
        orderUpdateQuery,
      );
      expect(order).toEqual({
        ...foundOrderMock,
        status: OrderStatus.CANCELLED,
      });
    });
  });

  describe('check order status', () => {
    it('should return status of order', async () => {
      const userId = 'dummyUserId';
      const checkOrderDTO: CheckOrderStatusDto = {
        orderId: 'dummy',
      };

      const foundOrderMock: Order = {
        amount: 10000,
        createdBy: userId,
        paymentId: '',
        status: OrderStatus.CONFIRMED,
        tax: 10,
        total: 20000,
      };

      const orderUpdateQuery = {
        status: OrderStatus.CANCELLED,
      };

      orderRepositoryMock.findOne.mockResolvedValue(foundOrderMock as never);
      const order = await service.checkOrderStatus(checkOrderDTO, userId);
      expect(orderRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.findOne).toHaveBeenCalledWith(
        {
          _id: checkOrderDTO.orderId,
          createdBy: userId,
        },
        true,
      );
      expect(order).toEqual(foundOrderMock);
    });
  });

  describe('check order status', () => {
    it('should return status of order', async () => {
      const userId = 'dummyUserId';
      const foundOrdersMock: Order[] = [
        {
          amount: 10000,
          createdBy: userId,
          paymentId: '',
          status: OrderStatus.CONFIRMED,
          tax: 10,
          total: 20000,
        },
        {
          amount: 20000,
          createdBy: userId,
          paymentId: '',
          status: OrderStatus.CANCELLED,
          tax: 10,
          total: 20000,
        },
      ];

      orderRepositoryMock.find.mockResolvedValue(foundOrdersMock as never);
      const order = await service.all(userId);
      expect(orderRepositoryMock.find).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.find).toHaveBeenCalledWith({
        createdBy: userId,
      });
      expect(order).toEqual(foundOrdersMock);
    });
  });
});
