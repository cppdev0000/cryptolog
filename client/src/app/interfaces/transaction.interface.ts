export interface ITransaction {
  id: number;
  date: Date;
  coinName: string;
  count: number;
  value: number;
  fee: number;
}
