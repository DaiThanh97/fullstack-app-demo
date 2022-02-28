import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthGuard } from './../common/guards/auth.guard';
import { CancelOrderDto } from './dtos/cancel-order.dto';
import { CheckOrderStatusDto } from './dtos/check-order-status.dto';
import { CreateOrderDto } from './dtos/create-order.dto';
import { OrderByIdDto } from './dtos/order.dto';
import { OrderService } from './order.service';

@Resolver('Order')
@UseGuards(AuthGuard)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query('order')
  order(@Args('input') input: OrderByIdDto, @Context('userId') userId: string) {
    return this.orderService.orderById(input.orderId, userId);
  }

  @Query('orders')
  orders(@Context('userId') userId: string) {
    return this.orderService.all(userId);
  }

  @Query('checkOrderStatus')
  checkOrderStatus(
    @Args('input') input: CheckOrderStatusDto,
    @Context('userId') userId: string,
  ) {
    return this.orderService.checkOrderStatus(input, userId);
  }

  @Mutation('createOrder')
  createOrder(
    @Args('input') input: CreateOrderDto,
    @Context('userId') userId: string,
  ) {
    return this.orderService.createOrder(input, userId);
  }

  @Mutation('cancelOrder')
  cancelOrder(
    @Args('input') input: CancelOrderDto,
    @Context('userId') userId: string,
  ) {
    return this.orderService.cancelOrder(input, userId);
  }
}
