import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ISummary } from '../interfaces/summary.interface';
import { ITransaction } from '../interfaces/transaction.interface';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  transactions = new BehaviorSubject<ITransaction[]>([]);
  summary = new BehaviorSubject<ISummary>({});
  coinSummary = new BehaviorSubject<any>({});

  //**************************************************************************
  constructor(private http: HttpClient) {
  }

  //**************************************************************************
  requestSummary(): void {
    const token = sessionStorage.getItem('token');
    this.http.get<ISummary>(`${environment.TRANS_URL}/api/transactions/summary`, {
      headers: {
        'authorization': `bearer ${token}`
      }
    }).subscribe(data => {
      this.summary.next(data);
    });
  }

  //**************************************************************************
  requestCoinSummary(): void {
    const token = sessionStorage.getItem('token');
    this.http.get<any>(`${environment.TRANS_URL}/api/transactions/current`, {
      headers: {
        'authorization': `bearer ${token}`
      }
    }).subscribe(data => {
      this.coinSummary.next(data);
    });
  }

  //**************************************************************************
  refresh(dateString?: string): void {
    if (!dateString) {
      const date = new Date();
      const month = ('00' + (date.getMonth() + 1)).slice(-2);
      dateString = `${date.getFullYear()}${month}`;
    }
    console.log(`Date=${dateString}`);

    const token = sessionStorage.getItem('token');
    this.http.get<ITransaction[]>(`${environment.TRANS_URL}/api/transactions?date=${dateString}`, {
      headers: {
        'authorization': `bearer ${token}`
      }
    }).subscribe(data => {
      this.transactions.next(data);
    });
  }
}
