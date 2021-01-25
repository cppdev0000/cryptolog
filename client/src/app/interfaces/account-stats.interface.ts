export interface IAccountStats {
  firstTransactionDate: string;
  totalTransactions: number;
  totalFees: number;
  currentValue: number;
  totalInvested: number;
  coinList: any; // asset,count,current price total
}
