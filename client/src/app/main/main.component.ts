import { TransactionsService } from 'src/app/services/transactions.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  constructor(
    transactionService: TransactionsService
  ) {
    transactionService.refresh();
   }
}
