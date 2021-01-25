import { Transaction } from '../transactions/transaction';
import { Table, Column, Model, HasMany } from 'sequelize-typescript';

@Table
export class User extends Model {
  @Column
  email: string;

  @Column
  passwordHash: string;

  @Column
  totalIn: number;

  @Column
  totalFees: number;

  @HasMany(() => Transaction)
  transactions: Transaction[];
}
