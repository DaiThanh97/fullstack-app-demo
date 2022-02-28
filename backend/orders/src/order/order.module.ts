import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { Order, OrderSchema } from './schemas/order.schema';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DELIVERY_QUEUE, ORDER_SERVICE } from './order.constant';
import { OrderPublisher } from './events/order.publisher';
import { OrderController } from './order.controller';
import { DeliveryProcessor } from './processors/delivery.processor';
import { OrderRepository } from './repositories/order.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ClientsModule.registerAsync([
      {
        name: ORDER_SERVICE,
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          const NATS_HOST = configService.get<string>('NATS_HOST');
          const INTERNAL_KEY = configService.get<string>('INTERNAL_KEY');
          const SERVICE_NAME = configService.get<string>('SERVICE_NAME');
          return {
            transport: Transport.NATS,
            options: {
              servers: [NATS_HOST],
              headers: {
                internalKey: INTERNAL_KEY,
                publisher: SERVICE_NAME,
              },
            },
          };
        },
      },
    ]),
    BullModule.registerQueue({
      name: DELIVERY_QUEUE,
    }),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderRepository,
    OrderPublisher,
    DeliveryProcessor,
    OrderResolver,
  ],
})
export class OrderModule {}
