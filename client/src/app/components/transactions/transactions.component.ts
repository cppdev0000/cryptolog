import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { AccountService } from './../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
   months: any[] = [];
   currentMonth: string;

   //**************************************************************************
  constructor(
    public accountService: AccountService,
    public transactionsService: TransactionsService,
    private translate: TranslateService) {
      let currentDate = new Date();
      this.currentMonth = `${currentDate.getFullYear()}${("00" + (currentDate.getMonth() + 1)).slice(-2)}`;
    }

    //**************************************************************************
    ngOnInit(): void {
    this.createDropdownMonths();

    // Register a language change event to update month names in dropdown
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.createDropdownMonths();
    });
  }

  //**************************************************************************
  makeDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }

  //**************************************************************************
  normalizeCount(count: number): number {
    return Math.abs(count);
  }

  //**************************************************************************
  createDropdownMonths() : void {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1;
    const startMonth = currentMonth;
    let currentYear = currentDate.getFullYear();
    let currentValue: string;

    const monthNames = this.translate.instant('MONTH-NAMES');
    this.months = [];
    do {
      currentValue = `${currentYear}${("00" + currentMonth).slice(-2)}`;
      this.months.push({
        display: `${monthNames[currentMonth - 1]} ${currentYear}`,
        value: currentValue
      });

      currentMonth--;
      if (currentMonth == startMonth) break;

      if (currentMonth == 0) {
        currentMonth += 12;
        currentYear--;
      }
    } while (true);
  }

  //**************************************************************************
  monthChange(newMonth: string) {
    console.log(`Event - ${newMonth}`);
    this.currentMonth = newMonth;
    this.transactionsService.refresh(newMonth);
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
