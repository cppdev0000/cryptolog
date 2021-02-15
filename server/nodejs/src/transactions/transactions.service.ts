import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, getConnection, Repository } from 'typeorm';
import { ISnapshot } from './dto/snapshot.interface';
import { TransactionResource } from './transaction.resource';
import { TransactionModel } from './transaction.model';


@Injectable()
export class TransactionsService {
  //**************************************************************************
  constructor(
    @InjectRepository(TransactionModel) private transactionsRepository: Repository<TransactionModel>
    ) {}

  //**************************************************************************
  async getTransactions(id: number): Promise<any> {
    return this.transactionsRepository.find({
      select: [
        'id',
        'date',
        'asset',
        'count',
        'price',
        'fee'],
      where: [{
        userId: id
      }]  
    });
  }

  //**************************************************************************
  // TODO: Look into sending both queries in the same request
  async getSnapshot(id: number): Promise<any> {
    // Get current asset prices (Use caching to reduce hits)

    // Calculate total invested and total fees charged
    // SELECT SUM(`count` * `price`) AS totalInvested, SUM(fee) AS totalFees FROM Transactions
    const snapShot: ISnapshot = await getConnection()
      .getRepository(TransactionModel)
      .createQueryBuilder()
      .where("userId = :id", { id })
      .select('SUM(`count`*`price`)', 'totalInvested')
      .addSelect('SUM(`fee`)', 'totalFees')
      .getRawOne<any>();

    // SELECT `asset`, SUM(`count`) AS count FROM Transactions GROUP BY asset HAVING count > 0
    snapShot.assets = await getConnection()
      .getRepository(TransactionModel)
      .createQueryBuilder()
      .select('asset')
      .addSelect('SUM(`count`)', 'count')
      .where("userId = :id", { id })
      .groupBy('asset')
      .having('`count`>0')
      .getRawMany();
      
    return snapShot;
  }

  //**************************************************************************
  async insert(userId: number, transactionDTO: TransactionResource): Promise<any> {

    // DTO -> model
    const transaction: TransactionModel = {
      date: transactionDTO.date,
      asset: transactionDTO.asset,
      count: transactionDTO.count,
      price: transactionDTO.price,
      fee: transactionDTO.fee,
      userId
    }

    return this.transactionsRepository.save(transaction);
  }
  
  //**************************************************************************
  async update(id: number, transactionDTO: TransactionResource): Promise<TransactionModel> {
    const transaction = await this.transactionsRepository.findOne(id);

    if (transactionDTO.date) transaction.date = transactionDTO.date;
    if (transactionDTO.asset) transaction.asset = transactionDTO.asset;
    if (transactionDTO.count) transaction.count = transactionDTO.count;
    if (transactionDTO.price) transaction.price = transactionDTO.price;
    if (transactionDTO.fee) transaction.fee = transactionDTO.fee;
    
    return this.transactionsRepository.save(transaction);
  }
  
  //**************************************************************************
  async delete(id: number): Promise<DeleteResult> {
    return this.transactionsRepository.delete(id);
  }
}
