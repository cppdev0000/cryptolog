export interface TransactionDto {
  date: Date;
  action: string;
  asset: string;
  count: number;
  price: number;
  fee: number;
}
