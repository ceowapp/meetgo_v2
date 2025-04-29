export interface IResUserGoogle {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
  familyName: string | null;
  givenName: string | null;
}

export type IResUserApple = {
  email: string;
  fullName: {
    familyName: string;
    givenName: string;
  };
  user: string; //unique id
};

export type IAuthToken = {
  token: string;
  refreshToken: string;
};
export type IReqRegister = {
  idAuth: string;
  email?: string;
  firstname?: string;
  lastname?: string;
  photo?: string;
  referral: string | null;
  deviceID: string;
  tokenId: string;
  platform: 'APPLE' | 'GOOGLE' | 'APPLE_ANDROID';
};
export type IResRegister = {
  isSignUp: boolean;
  account: string;
  token: string;
  refreshToken: string;
};
