import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'orders' })
export class OrderEntity {
  @PrimaryColumn()
  orderId!: string;

  @Column()
  amount!: number;

  @Column()
  tax!: number;

  @Column()
  total!: number;
}
