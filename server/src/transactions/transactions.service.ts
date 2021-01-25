import { TransactionDto } from './dto/transaction.dto';
import { Transaction } from './transaction';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
//import { CreateCatDto } from './dto/create-cat.dto';


@Injectable()
export class TransactionsService {
  //**************************************************************************
  constructor(
    @InjectModel(Transaction) private readonly transactionsRepository: typeof Transaction ) {}

  //**************************************************************************
  async getAll(id: number): Promise<Transaction[]> {
    return this.transactionsRepository.findAll({
      where: {
        userId: id
      }
    });
  }

  //**************************************************************************
  async create(userId: number, transactionDTO: TransactionDto): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.date = transactionDTO.date;
    transaction.action = transactionDTO.action;
    transaction.asset = transactionDTO.asset;
    transaction.count = transactionDTO.count;
    transaction.price = transactionDTO.price;
    transaction.fee = transactionDTO.fee;
    transaction.createdAt = new Date();
    transaction.updatedAt = new Date();
    transaction.userId = userId;
    
    return transaction.save();
  }
  
  //**************************************************************************
  async update(userId: number, transactionDTO: TransactionDto): Promise<Transaction> {
    const transaction = new Transaction();
    transaction.date = transactionDTO.date;
    transaction.action = transactionDTO.action;
    transaction.asset = transactionDTO.asset;
    transaction.count = transactionDTO.count;
    transaction.price = transactionDTO.price;
    transaction.fee = transactionDTO.fee;
    transaction.createdAt = new Date();
    transaction.updatedAt = new Date();
    transaction.userId = userId;
    
    return transaction.save();
  }
  
  //**************************************************************************
  async delete(id: number): Promise<void> {
    const user = await this.transactionsRepository.findByPk(id);

    await user.destroy();
  }
}
