import { Component, OnInit } from '@angular/core';
import { ISummary } from 'src/app/interfaces/summary.interface';
import { TransactionsService } from 'src/app/services/transactions.service';

@Component({
  selector: 'app-current-totals',
  templateUrl: './current-totals.component.html',
  styleUrls: ['./current-totals.component.css']
})
export class CurrentTotalsComponent implements OnInit {
  summary: ISummary;

  constructor(private transactionsService: TransactionsService) { }

  ngOnInit(): void {
    this.transactionsService.summary.subscribe(data => {
      if (data) {
        this.summary = data;
      }
    });
  }
}
