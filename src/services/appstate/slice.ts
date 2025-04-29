import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppStateStatus} from 'react-native';
import {RootState} from 'storeConfig/rootStore';

type IStateAppState = {
  appstate: AppStateStatus;
};

const initialState: IStateAppState = {
  appstate: 'active',
};

// Slice
const appStateSlice = createSlice({
  name: 'service:appstate',
  initialState,
  reducers: {
    updateAppState: (state, action: PayloadAction<AppStateStatus>) => {
      state.appstate = action.payload;
    },
  },
});

// Selectors
const getAppState = (state: RootState): AppStateStatus =>
  state.services.appstate.appstate;
export const appStateSelector = {
  getAppState,
};

// Actions
export const appStateActions = appStateSlice.actions;

export default appStateSlice.reducer;
