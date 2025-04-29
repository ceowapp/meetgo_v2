import {createSlice} from '@reduxjs/toolkit';
import {PersistConfig} from 'redux-persist/lib/types';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootState} from 'storeConfig/rootStore';
import {RESET_ALL_STATE} from 'storeConfig/types';

type ISettings = {
  url: string;
};

const initialState: ISettings = {
  url: '',
};

// Slice
const settingsSlice = createSlice({
  name: 'service:settings',
  initialState,
  reducers: {
    setUrl: (state, action) => {
      state.url = action.payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(RESET_ALL_STATE, () => {
      return initialState;
    });
  },
});

// Selectors
const getUrl = (state: RootState) => state.services.settings.url;
export const SettingsSelector = {
  getUrl,
};

// Actions
export const settingsActions = settingsSlice.actions;

// Reducers
const persistConfig: PersistConfig<typeof initialState> = {
  key: 'service:settings',
  storage: AsyncStorage,
};
export default persistReducer(persistConfig, settingsSlice.reducer);
