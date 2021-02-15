import { TransactionResource } from './transaction.resource';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { Controller, Request, Get, Post, Delete, Body, Patch } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionModel } from './transaction.model';
import { UseGuards } from '@nestjs/common';
import { Param } from '@nestjs/common';
import { UserService } from 'src/users/user.service';

@Controller('api/transactions')
export class TransactionsController {
  //**************************************************************************
  constructor(
    private readonly transactionsService: TransactionsService,
    private readonly userService: UserService
    ) {}

  //**************************************************************************
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Request() req): Promise<TransactionModel[]> {
    return this.transactionsService.getTransactions(req.user.userId);
      /*.then(user => user.transactions.map(transaction => {
        return {
          date: transaction.date,
          asset: transaction.asset,
          count: transaction.count,
          price: transaction.price,
          fee: transaction.fee
        }
      }))*/
  }

  //**************************************************************************
  @UseGuards(JwtAuthGuard)
  @Get('snapshot')
  getSnapshot(@Request() req): Promise<any[]> {
    return this.transactionsService.getSnapshot(req.user.userId);
  }
  
  //**************************************************************************
  @UseGuards(JwtAuthGuard)
  @Post()
  createTransaction(@Body() transactionDto: TransactionResource, @Request() req): Promise<TransactionModel> {
    console.log(transactionDto);
    return this.transactionsService.insert(req.user.userId, transactionDto);
      /*.then(transaction =>
        {
          id: transaction.id,
          date: transaction.date,
          asset: transaction.asset,
          count: transaction.count,
          price: transaction.price,
          fee: transaction.fee
        });*/
  }
  
  //**************************************************************************
  @UseGuards(JwtAuthGuard)
  @Patch()
  updateTransaction(@Body() transactionDto: TransactionResource, @Request() req): Promise<TransactionModel> {
    console.log(transactionDto);
    return this.transactionsService.update(req.user.userId, transactionDto);
  }
  
  //**************************************************************************
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteTransaction(@Param('id') id: number): Promise<void> {
    await this.transactionsService.delete(id);
  }
}
