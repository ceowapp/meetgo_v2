export type IReqNearByMe = {
  currentPage: number;
  currentLat: number;
  currentLong: number;
};
export enum EStatusLocation {
  BUYED = 'BUYED',
  SHOP = 'SHOP',
  PENDING = 'PENDING',
  GIFT = 'GIFT',
}
export type LocationInfo = {
  id?: string;
  address: string;
  visionAddress?: string;
  latitude: number;
  longitude: number;
  owner: string;
  distanceInKm: number | string;
  statusLocation: EStatusLocation;
  imageShopLocation: string;
  rateBonus?: number;
  totalOfMeet: number;
  totalOfEarn: number;
};
export type IResNearByMe = LocationInfo & {
  key: string;
};

export type IReqAddressDetail = {
  idLocation: string;
  account: string;
  currentLat: number;
  currentLong: number;
};
export type IResAddressDetail = LocationInfo;

export type IReqLocationSearch = {
  account: string;
  keyword: string;
  currentLat: number;
  currentLong: number;
};

export type IResLocationSearch = IResNearByMe;
export type IReqNearByMap = {
  mapLat: number;
  mapLong: number;
  currentLat: number | string;
  currentLong: number | string;
};
export type IResNearByMap = {
  key: string;
} & LocationInfo;

export type ILocation = {
  latitude: number;
  longitude: number;
};
