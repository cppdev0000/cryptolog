import { ITransaction } from './../../interfaces/transaction.interface';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { IAccountStats } from '../../interfaces/account-stats.interface';
import { AccountService } from './../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
   info: IAccountStats;
   months: any[] = [];
   currentMonth: string;

   //**************************************************************************
  constructor(
    public accountService: AccountService,
    public transactionsService: TransactionsService,
    private translate: TranslateService) {
      let currentDate = new Date();
      this.currentMonth = `${currentDate.getFullYear()}${("00" + currentDate.getMonth()).slice(-2)}`;
  }

  //**************************************************************************
  ngOnInit(): void {
    this.transactionsService.accountStats.subscribe(data => {
      if (data) {
        this.info = data;
        this.getTransactionMonths();
      }
    })

    // Register a language change event to update month names in dropdown
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      // this.getTransactionMonths();
    });
  }

  //**************************************************************************
  makeDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  //**************************************************************************
  getTransactionMonths() : void {
    const openDate =  new Date(this.info?.firstTransactionDate);
    const targetValue = `${openDate.getFullYear()}${("00" + openDate.getMonth()).slice(-2)}`;

    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    let currentValue: string;

    const monthNames = this.translate.instant('MONTH-NAMES');
    this.months = [];
    do {
      currentValue = `${currentYear}${("00" + currentMonth).slice(-2)}`;
      this.months.push({
        display: `${monthNames[currentMonth]} ${currentYear}`,
        value: currentValue
      });

      currentMonth--;
      if (currentMonth < 0) {
        currentMonth += 12;
        currentYear--;
      }
    } while (currentValue != targetValue);
  }

  //**************************************************************************
  monthChange(newMonth: string) {
    //console.log(`Event - ${event}`);
    this.currentMonth = newMonth;
  }

  //**************************************************************************
  addTransaction(): void {

  }

  //**************************************************************************
  editTransaction(id: number): void {

  }

  //**************************************************************************
  deleteTransaction(id: number): void {

  }
}
