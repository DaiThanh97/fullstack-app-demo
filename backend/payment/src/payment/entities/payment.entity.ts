import {
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PaymentStatus } from '../types/payment.enum';

@Entity({ name: 'payment' })
export class PaymentEntity {
  @PrimaryGeneratedColumn('uuid')
  @Index('IDX_ID')
  id!: number;

  @Column()
  orderId!: string;

  @CreateDateColumn()
  createDateTime!: Date;

  @UpdateDateColumn({ nullable: true })
  updatedDateTime?: Date;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status!: string;
}
