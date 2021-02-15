import { TransactionModel } from '../transactions/transaction.model';

import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('Users')
export class UserModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  passwordHash: string;

  @Column()
  totalIn: number;

  @Column()
  totalFees: number;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => TransactionModel, transaction => transaction.user)
  transactions: TransactionModel[];

  @Column({ default: `${new Date()}`})
  createdAt: Date;
  
  @Column({ default: `${new Date()}`})
  updatedAt: Date;
}
