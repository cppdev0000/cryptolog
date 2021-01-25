import { TransactionsService } from 'src/app/services/transactions.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-coin-totals',
  templateUrl: './coin-totals.component.html',
  styleUrls: ['./coin-totals.component.css']
})
export class CoinTotalsComponent implements OnInit {
  coinList: any;

  constructor(
    private transactionsService: TransactionsService
  ) { }

  ngOnInit(): void {
    this.transactionsService.accountStats.subscribe(data => {
      if (data) {
        this.coinList = data.coinList;
      };
    });
  }
}
