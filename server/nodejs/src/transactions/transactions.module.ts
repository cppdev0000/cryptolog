import { UserModule } from './../users/user.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionModel } from './transaction.model';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionModel]),
    UserModule
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService]
})
export class TransactionModule {}