import { IsNumber, Min } from 'class-validator';
import { OrderCreateInput } from './../../graphql';

export class CreateOrderDto extends OrderCreateInput {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsNumber()
  @Min(0)
  tax: number;

  @IsNumber()
  @Min(0)
  total: number;
}
