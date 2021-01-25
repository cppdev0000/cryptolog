import { Table, Column, Model, PrimaryKey, ForeignKey } from 'sequelize-typescript';
import { BelongsTo, HasOne } from 'sequelize/types';
import { User } from 'src/users/user';

@Table
export class Transaction extends Model {
  @PrimaryKey
  @Column
  id: number;

  @Column
  date: Date;

  @Column
  action: string;

  @Column
  asset: string;

  @Column
  count: number;

  @Column
  price: number;

  @Column
  fee: number;

  @ForeignKey(() => User)
  @Column
  userId: number;

  //@BelongsTo()
  //user: User;
}
