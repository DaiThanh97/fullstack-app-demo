import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderStatus } from '../../graphql';
import { Document, LeanDocument, LeanArray } from 'mongoose';

export type OrderDocument = Order & Document;
export type LeanOrderDocument = LeanDocument<OrderDocument>;
export type LeanArrayOrderDocument = LeanArray<OrderDocument[]>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: String, default: '' })
  paymentId: string;

  @Prop({ type: Number, default: 0 })
  amount: number;

  @Prop({ type: Number, default: 0 })
  tax: number;

  @Prop({ type: Number, default: 0 })
  total: number;

  @Prop({ type: String, default: OrderStatus.CREATED })
  status: OrderStatus;

  @Prop({ type: String, default: '' })
  createdBy: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
