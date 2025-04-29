import {createStackNavigator} from '@react-navigation/stack';
import {IResInfoKyc} from 'scenes/account/redux/types';
import {IDataEarn} from 'scenes/earn/redux/types';
import {ILocation, LocationInfo} from 'scenes/locations/redux/type';
import {IResHistoryMeet} from 'scenes/meets/redux/types';
import {IQrUserInfo} from 'scenes/meets/screens/UserScan/types';

export const AppStack = createStackNavigator();

export const STACK_NAVIGATOR = {
  BOTTOM_TAB_BAR: 'BOTTOM_TAB_BAR',
  BOTTOM_TAB: {
    HOME: 'HOME',
    LOCATION_NFT: 'LOCATION_NFT',
    ACCOUNT: 'ACCOUNT',
    MEET_SCAN: 'MEET_SCAN',
  },
  AUTH_NAVIGATOR: 'AUTH_NAVIGATOR',
  APP_NAVIGATOR: 'APP_NAVIGATOR',
  LOGIN: 'LOGIN',
  LOCATION_MAP: 'LOCATION_MAP',
  LOCATION_DETAIL: 'LOCATION_DETAIL',
  // account tab
  AUTHEN_ONBOARD: 'AUTHEN_ONBOARD',
  HISTORY_MEET: 'HISTORY_MEET',
  HISTORY_MEET_DETAIL: 'HISTORY_MEET_DETAIL',
  HISTORY_POINT: 'HISTORY_POINT',
  INVITE_FRIEND: 'INVITE_FRIEND',
  INPUT_CODE: 'INPUT_CODE',
  USER_GUIDE: 'USER_GUIDE',
  WEB_VIEW: 'WEB_VIEW',
  MANAGE_ACC: 'MANAGE_ACC',
  UPDATE_ACCOUNT: 'UPDATE_ACCOUNT',
  VERIFY_ACCOUNT: 'VERIFY_ACCOUNT',
  PREVIEW_ACCOUNT: 'PREVIEW_ACCOUNT',
  LANGUAGE_SETTING: 'LANGUAGE_SETTING',
  REFERRAL_LIST: 'REFERRAL_LIST',

  // home
  MY_QR: 'MYQR',
  // meet
  USER_SCAN: 'USER_SCAN',
  MEET_TOGETHER: 'MEET_TOGETHER',
  // EARN
  EARN: 'EARN',
  HISTORY_EARN: 'HISTORY_EARN'  
};

export type AppStackParamList = {
  WEB_VIEW: {
    title: string;
    url: string;
  };
  LOCATION_MAP: {
    locationNFT: LocationInfo;
  };
  LOCATION_DETAIL: {
    locationData: LocationInfo;
    regionCenter: ILocation;
  };
  MY_QR: undefined;
  USER_SCAN: {
    qrInfo: IQrUserInfo;
  };
  CONNECT_TOGETHER: {
    connectId: string;
  };
  VERIFY_ACCOUNT: {
    infoKyc: IResInfoKyc;
  };
  PREVIEW_KYC: {
    infoKyc: IResInfoKyc;
  };
  HISTORY_MEET_DETAIL: {
    item: IResHistoryMeet;
  };
  EARN: {
    locationID: string;
    address: string;
    owner: string;
    imageShopLocation: string;
    dataEarn?: IDataEarn;
  };
};
