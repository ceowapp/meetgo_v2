import {IReqUser} from 'constant/commonType';

export type IStateUser = {
  idAuth: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  photo?: string;
  isVerify?: boolean;
  refferalCode?: string;
  createdAtTimestamp?: number;
  birthday?: string;
  mobilenumber?: string;
  address?: string;
  gender?: string;
  meetpoint?: number;
  numberOfMeet?: number;
  numberOfEarn?: number;
};

export type IResUserReferral = {
  account?: string;
  email?: string;
  fullname?: string;
  createdAtTimestamp?: number;
};

export type IResUser = {
  idAuth: string;
  email: string;
  firstname: string;
  lastname: string;
  createdAt: string;
  isVerify: boolean;
  meetpoint: number;
  numberOfMeet: number;
};

export type IReqUpdateAvatar = IReqUser & IDataImage;

export type IDataImage = {
  uri: string;
  fileName: string;
  type: string;
};
export type IResUpdateAvatar = {
  url: string;
};

export type IReqUpdateUserInfo = IReqUser & {
  idAuth: string;
  firstname: string;
  lastname: string;
  email?: string;
  birthday?: string;
  mobilenumber?: string;
  address?: string;
  gender?: string;
};

export type IFormOnboarding = IReqUser & {
  firstname?: string;
  lastname?: string;
  idAuth: string;
  email?: string;
  referral?: string | null;
};

export type IReqUpdateInfoKYC = {
  fullname: string;
  idday: string;
  idnumber: string;
  idplace: string;
  birthday: string;
};
export type IReqUploadImg = IDataImage;
export type IResInfoKyc = {
  account: string;
  birthday: string;
  createdAt: string;
  createdAtTimestamp: number;
  fullname: string;
  idAuth: string;
  idday: string;
  idnumber: string;
  idplace: string;
  isVerify: boolean;
  messageVerify: string;
  statusVerify: 'NONE' | 'REJECT' | 'PENDING' | 'DONE';
  step: number;
  storeUrlBackID: string;
  storeUrlFrontID: string;
  storeUrlKycWithID: string;
  updatedAt: string;
  updatedAtTimestamp: number;
};
