import { UserModel } from 'src/users/user.model';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('Transactions')
export class TransactionModel {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  date: Date;

  @Column()
  asset: string;

  @Column()
  count: number;

  @Column()
  price: number;

  @Column()
  fee: number;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => UserModel, user => user.transactions)
  user?: UserModel;
}
