import { IAsset } from './asset.interface';

export interface ISnapshot {
  totalInvested?: number;
  totalFees?: number;
  assets?: IAsset[];
}
