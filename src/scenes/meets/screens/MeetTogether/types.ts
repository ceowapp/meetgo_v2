import {IStatusMeet} from 'constant/commonType';

export type IDataListenMeet = {
  connectId: string;
  createdAtTimestamp: number;
  createdAt: string;
  statusMeet: IStatusMeet;
  accountInvite: string;
  firstnameAccountInvite: string;
  lastnameAccountInvite: string;
  imageAccountInvite: string;
  emailAccountInvite: string;
  accountInvited: string;
  firstnameAccountInvited: string;
  lastnameAccountInvited: string;
  imageAccountInvited: string;
  emailAccountInvited: string;
  latitude: number;
  longtitude: number;
  countdownTime: number;
  address: string;
  totalOfMeet: number;
};
