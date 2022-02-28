import { IsString, IsMongoId } from 'class-validator';
import { OrderByIdInput } from './../../graphql';

export class OrderByIdDto extends OrderByIdInput {
  @IsString()
  @IsMongoId()
  orderId: string;
}
