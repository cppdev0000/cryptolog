import { TransactionDto } from './dto/transaction.dto';
import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import { Controller, Request, Get, Post, Delete, Body, Patch } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { Transaction } from './transaction';
import { UseGuards } from '@nestjs/common';
import { Param } from '@nestjs/common';

@Controller('api/transactions')
export class TransactionsController {
  //**************************************************************************
  constructor(private readonly transactionsService: TransactionsService) {}

  //**************************************************************************
  @UseGuards(JwtAuthGuard)
  @Get()
  getAll(@Request() req): Promise<TransactionDto[]> {
    return this.transactionsService.getAll(req.user.userId).then(transactions => transactions.map(transaction => {
      return {
        date: transaction.date,
        action: transaction.action,
        asset: transaction.asset,
        count: transaction.count,
        price: transaction.price,
        fee: transaction.fee
      }
    }))
  }
  
  //**************************************************************************
  @UseGuards(JwtAuthGuard)
  @Post()
  createTransaction(@Body() transactionDto: TransactionDto, @Request() req): Promise<Transaction> {
    console.log(transactionDto);
    return this.transactionsService.create(req.user.userId, transactionDto);
      /*.then(transaction =>
        {
          id: transaction.id,
          date: transaction.date,
          action: transaction.action,
          asset: transaction.asset,
          count: transaction.count,
          price: transaction.price,
          fee: transaction.fee
        });*/
  }
  
  //**************************************************************************
  @UseGuards(JwtAuthGuard)
  @Patch()
  updateTransaction(@Body() transactionDto: TransactionDto, @Request() req): Promise<Transaction> {
    console.log(transactionDto);
    return this.transactionsService.update(req.user.userId, transactionDto);
  }
  
  //**************************************************************************
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteTransaction(@Param('id') id: number): Promise<void> {
    return this.transactionsService.delete(id);
  }
}
