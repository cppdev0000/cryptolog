export interface ITransaction {
  id: number;
  date: Date;
  action: string;
  asset: string;
  count: number;
  price: number;
  fee: number;
}
