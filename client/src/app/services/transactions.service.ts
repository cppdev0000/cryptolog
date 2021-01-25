import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAccountStats } from '../interfaces/account-stats.interface';
import { ITransaction } from '../interfaces/transaction.interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  _accountStats: IAccountStats;
  accountStats = new BehaviorSubject<IAccountStats>(null);
  transactions = new BehaviorSubject<ITransaction[]>([]);

/*  _transactions: ITransaction[] = [
    {
      id: 1,
      date: new Date('1/3/2021'),
      asset: 'BTC',
      count: 0.25,
      fee: 100,
      price: 6800,
      action: 'A'
    },
    {
      id: 2,
      date: new Date('1/3/2021'),
      asset: 'ETH',
      count: 2,
      fee: 20,
      price: 800,
      action: 'A'
    },
    {
      id: 3,
      date: new Date('1/2/2021'),
      asset: 'ETH',
      count: 8,
      fee: 80,
      price: 800,
      action: 'A'
    },
    {
      id: 4,
      date: new Date('1/1/2021'),
      asset: 'LINK',
      count: 200,
      fee: 0,
      price: 15,
      action: 'A'
    }
  ];*/

  //**************************************************************************
  constructor(private http: HttpClient) {
  }

  //**************************************************************************
  refresh(): void {
    const token = sessionStorage.getItem('token');
    this.http.get<ITransaction[]>(`${environment.BaseURL}/api/transactions`, {
      headers: {
        'authorization': `bearer ${token}`
      }
    }).subscribe(data => {
      //this._transactions = data;
      this.transactions.next(data);

      this._accountStats = this.convert(data);
      this.accountStats.next(this._accountStats);
    });

    //this._accountInfo = this.convert(this._transactions);
    //this.accountInfo.next(this._accountInfo);
    //this.transactions.next(this._transactions);
  }

  //**************************************************************************
  convert(transactions: ITransaction[]): IAccountStats {
    const currentValue = 0;
    let totalFees = 0;
    const coinList = {};
    let totalInvested = 0;

    // Group by coin and sum of coin
    transactions.forEach(transaction => {
      if (coinList[transaction.asset]) {
        coinList[transaction.asset] += transaction.price * transaction.count;
      }
      else {
        coinList[transaction.asset] = transaction.price * transaction.count;
      }

      totalInvested += transaction.price * transaction.count;
      totalFees += transaction.fee;

      transaction.action = transaction.action == "A" ? 'Bought' : 'Sold';
    });

    return {
      totalTransactions: transactions.length,
      coinList,
      currentValue,
      firstTransactionDate: '06-01-2020',
      totalFees,
      totalInvested
    }
  }

  //**************************************************************************
  /*getTransactions(date: string): ITransaction[] {
    const year = Number.parseInt(date.slice(0, 4));
    const month = Number.parseInt(date.slice(4));

    let t = this.transactions
      .filter(x => x.date.getMonth() == month && x.date.getFullYear() == year)
      .sort((a, b) => b.date.getDate() - a.date.getDate());

    return t;
  }*/
}
