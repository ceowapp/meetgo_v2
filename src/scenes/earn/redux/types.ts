import {IAccount} from 'constant/commonType';

export type IReqStartEarn = IAccount & IReqCurrentShop;
export type IReqCurrentShop = {
  currentLat: number;
  currentLong: number;
  locationID: string;
};
export type IReqCurrentEarn = {
  currentLat: number;
  currentLong: number;
  earnID: string;
};
export type IDataEarn = {
  earnID: string;
  createdAtTimestamp: number;
  createdAt: string;
  locationID: string;
  latitude: number;
  longitude: number;
  countdownTime: number;
  isAddMeetPoint: boolean;
  totalOfEarn: number;
  address: string;
  statusEarn: 'READY' | 'FAIL' | 'DONE';
  statusMessage: string;
  ownerLocation?: string;
  meetpointForAccount: number;
};
export type IResStartEarn = IDataEarn;

export type IReqCheckEarn = IAccount & {
  currentLat: number;
  currentLong: number;
  earnID: string;
};

export type IResCheckEarn = {
  statusEarn: string | 'FAIL' | 'READY';
  statusMessage: string;
};

export type IReqGetLastEarn = IAccount;
export type IReqHistoryEarn = IAccount;
export type IResGetLastEarn = null | {
  earnDetail: IDataEarn;
};
export type IReqVerifyEarn = IAccount & IReqCurrentEarn;

export type IReqCancelEarn = IAccount & {
  earnID: string;
};
export type IResHistoryEarn = IDataEarn[];
