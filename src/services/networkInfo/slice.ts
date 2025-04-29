import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from 'storeConfig/rootStore';

type IStateNetworkInfo = {
  connectionStatus: boolean;
};

const initialState: IStateNetworkInfo = {
  connectionStatus: true,
};

// Slice
const networkSlice = createSlice({
  name: 'service:networkInfo',
  initialState,
  reducers: {
    updateStatusNetwork: (state, action: PayloadAction<boolean>) => {
      state.connectionStatus = action.payload;
    },
  },
});

// Selectors
const getStatusNetwork = (state: RootState): boolean =>
  state.services.network.connectionStatus;
export const NetworksSelector = {
  getStatusNetwork,
};

// Actions
export const networkActions = networkSlice.actions;

export default networkSlice.reducer;
