import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { PaymentService } from './payment.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PAYMENT_QUEUE, PAYMENT_SERVICE } from './payment.constant';
import { PaymentController } from './payment.controller';
import { PaymentRepository } from './repositories/payment.repository';
import { OrderRepository } from './repositories/order.repository';
import { PaymentPublisher } from './events/payment.publisher';
import { PaymentProcessor } from './processors/payment.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentRepository, OrderRepository]),
    ClientsModule.registerAsync([
      {
        name: PAYMENT_SERVICE,
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
      name: PAYMENT_QUEUE,
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentPublisher, PaymentProcessor],
})
export class PaymentModule {}
