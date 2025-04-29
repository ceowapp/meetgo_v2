import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RESULTS} from 'react-native-permissions';
import {ILocation} from 'scenes/locations/redux/type';
import {IDataFakeLocation} from 'scenes/meets/redux/types';
import {RootState} from 'storeConfig/rootStore';

type IStateCurrentLocation = {
  myLocation: ILocation | null;
  permisionLocation: string;
  dataFakeLocation: IDataFakeLocation | null;
};

const initialState: IStateCurrentLocation = {
  myLocation: null,
  permisionLocation: RESULTS.DENIED,
  dataFakeLocation: null,
};

// Slice
const locationSlice = createSlice({
  name: 'service:location',
  initialState,
  reducers: {
    updateLocation: (state, action: PayloadAction<ILocation>) => {
      state.myLocation = action.payload;
    },
    updatePermissionLocation: (state, action: PayloadAction<string>) => {
      state.permisionLocation = action.payload;
    },
    updateFakeLocation: (
      state,
      action: PayloadAction<IDataFakeLocation | null>,
    ) => {
      state.dataFakeLocation = action.payload;
    },
  },
});

// Selectors
const getCurentLocation = (state: RootState): ILocation | null =>
  state.services.location.myLocation;
const getPermissionLocation = (state: RootState): string =>
  state.services.location.permisionLocation;
const getDataFakeLocation = (state: RootState): IDataFakeLocation | null =>
  state.services.location.dataFakeLocation;
export const locationSelector = {
  getCurentLocation,
  getPermissionLocation,
  getDataFakeLocation,
};

// Actions
export const locationActions = locationSlice.actions;

export default locationSlice.reducer;
