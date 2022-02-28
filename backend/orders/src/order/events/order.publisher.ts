import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { ORDER_CREATED_EVENT } from './../../common/events';
import { ORDER_SERVICE } from '../order.constant';
import { IOrderCreatedEvent } from '../types/order.types';

@Injectable()
export class OrderPublisher {
  constructor(@Inject(ORDER_SERVICE) private readonly client: ClientProxy) {}

  createOrder(data: IOrderCreatedEvent): Observable<string> {
    return this.client.emit<string, IOrderCreatedEvent>(
      ORDER_CREATED_EVENT,
      data,
    );
  }
}
