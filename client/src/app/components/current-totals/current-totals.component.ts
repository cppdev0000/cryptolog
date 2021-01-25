import { Component, OnInit } from '@angular/core';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
  selector: 'app-current-totals',
  templateUrl: './current-totals.component.html',
  styleUrls: ['./current-totals.component.css']
})
export class CurrentTotalsComponent implements OnInit {
  totalInvested: number;
  currentValue: number;
  totalFees: number;

  constructor(private transactionsService: TransactionsService) { }

  ngOnInit(): void {
    this.transactionsService.accountStats.subscribe(data => {
      if (data) {
        this.totalInvested = data.totalInvested;
        this.currentValue = data.currentValue;
        //this.profit = data.profit;
        this.totalFees = data.totalFees;
      }
    });
  }
}
