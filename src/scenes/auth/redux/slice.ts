import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PersistConfig} from 'redux-persist/lib/types';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootState} from 'storeConfig/rootStore';
import {IAuthToken} from './types';
import {RESET_ALL_STATE} from 'storeConfig/types';

type IAuthState = {
  token: string;
  refreshToken: string;
  isFirstTimeRegister: boolean;
  account: string;
};

const initialState: IAuthState = {
  token: '',
  refreshToken: '',
  isFirstTimeRegister: false,
  account: '',
};

// Slice
const authSlice = createSlice({
  name: 'data:auth',
  initialState,
  reducers: {
    updateCoupleToken: (state, action: PayloadAction<IAuthToken>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    setRegisterSuccess: state => {
      state.isFirstTimeRegister = true;
    },
    setAccount: (state, action: PayloadAction<string>) => {
      state.account = action.payload;
    },
    logoutApp: () => {
      return initialState;
    },
  },
  extraReducers: builder => {
    builder.addCase(RESET_ALL_STATE, () => {
      return initialState;
    });
  },
});

// Selectors
const getToken = (state: RootState) => state.data.auth.token;
const getAccount = (state: RootState) => state.data.auth.account;

const getRefreshToken = (state: RootState) => state.data.auth.refreshToken;
const getFirstTimeRegister = (state: RootState) =>
  state.data.auth.isFirstTimeRegister;

export const AuthSelector = {
  getToken,
  getAccount,
  getRefreshToken,
  getFirstTimeRegister,
};

// Actions
export const AuthActions = authSlice.actions;

// Reducers
const persistConfig: PersistConfig<typeof initialState> = {
  key: 'data:auth',
  storage: AsyncStorage,
};
export default persistReducer(persistConfig, authSlice.reducer);
