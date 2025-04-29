import {IAccount, IStatusMeet} from 'constant/commonType';

export type IReqInviteUserOther = {
  account: string;
  accountConnect: string;
  latitudeNFT: number;
  longtitudeNFT: number;
  currentLat: number;
  currentLong: number;
  addressNFT: string;
  locationID: string;
};

export type IReqConfirmEndMeeting = {
  account: string;
  connectId: string;
};
export type IReqPendingSuccess = IReqConfirmEndMeeting;
export type IReqRejectMeeting = IReqConfirmEndMeeting;
export type IDataConnect = {
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
};
export type IResDataInvite = {connectId: IDataConnect};

export type IReqInvitedSendConfirm = IAccount & {
  connectId: string;
  accountInvite: string;
  currentLat: number;
  currentLong: number;
};

export type IReqLocationNearByMe = {
  currentLat: number;
  currentLong: number;
};
export type IResLocationMeetNearByMe = {
  key: string;
  accountOwner: string;
  address: string;
  createdAt: string;
  createdAtTimestamp: number;
  id: string;
  imageHostLocation: string;
  imageLocation: string;
  latitude: number;
  longitude: number;
  owner: string;
  statusLocation: string;
  distanceInKm: number;
  rateBonus?: number;
};

export type IResHistoryMeet = {
  accountInvite: string;
  accountInvited: string;
  address: string;
  connectId: string;
  countdownTime: number;
  createdAt: string;
  createdAtTimestamp: number;
  emailAccountInvite: string;
  emailAccountInvited: string;
  firstnameAccountInvite: string;
  firstnameAccountInvited: string;
  imageAccountInvite: string;
  imageAccountInvited: string;
  lastnameAccountInvite: string;
  lastnameAccountInvited: string;
  latitude: number;
  longtitude: number;
  statusMeet: IStatusMeet;
  meetpointForInvite: number;
  meetpointForInvited: number;
};
export type IResHistoryTransfer = {
  createdAt: string;
  randomID: string;
  amount: number;
  createdAtTimestamp: string;
  description: string;
  accountSend: string;
  accountReceive: string;
  pack: string;
  statusPack: string;
  contentPack: string;
  transactionID: string;
  status: string;
};

export type IReqCheckMeetAgain = {
  account: string;
  accountConnect: string;
};
export type IDataHistoryMeet = {
  inviteLong: number;
  meetpointForRefInvited: number;
  accountInvite: string;
  countdownTime: number;
  firstnameAccountInvite: string;
  latitude: number;
  longtitude: number;
  imageAccountInvited: string;
  accountInvited: string;
  createdAt: string;
  imageAccountInvite: string;
  rateBonus: number;
  lastnameAccountInvite: string;
  meetpointForCapital: number;
  firstnameAccountInvited: string;
  meetpointForInvite: number;
  connectId: string;
  statusMeet: string;
  meetpointForInvited: number;
  refInvite: null;
  address: string;
  inviteLat: number;
  lastnameAccountInvited: string;
  isAddMeetPoint: boolean;
  meetpointForRefInvite: number;
  createdAtTimestamp: number;
  emailAccountInvite: string;
  emailAccountInvited: string;
  locationID: string;
  accountOwnerNFT: string;
};
export type IResCheckMeetAgain = {
  listMeet: IDataHistoryMeet[];
  content: string;
  rateBonusAgain: number;
};

export type IDataFakeLocation = {
  addressNFT: string;
  currentLat: number;
  currentLong: number;
  isFake: boolean;
  latitudeNFT: number;
  locationID: string;
  longtitudeNFT: number;
};
