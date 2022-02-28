import { IsMongoId, IsString } from 'class-validator';
import { CheckOrderStatusInput } from '../../graphql';

export class CheckOrderStatusDto extends CheckOrderStatusInput {
  @IsMongoId()
  orderId: string;
}
