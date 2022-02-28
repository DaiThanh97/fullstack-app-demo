import { IsMongoId, IsString } from 'class-validator';
import { OrderCancelInput } from '../../graphql';

export class CancelOrderDto extends OrderCancelInput {
  @IsString()
  @IsMongoId()
  orderId: string;
}
