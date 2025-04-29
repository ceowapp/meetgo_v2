import {
  ILocation,
  IReqNearByMap,
  LocationInfo,
} from 'scenes/locations/redux/type';

export type IActionMarkerLocation = {
  getMarketLocation: (data: IReqNearByMap) => void;
};

export type IPropsListMarkerLocation = {
  selectLocation: (data: LocationInfo) => void;
};

export type IActionCurrentLocation = {
  getCurrentLocation: () => ILocation;
};
