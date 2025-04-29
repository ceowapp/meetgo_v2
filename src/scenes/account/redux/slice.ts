import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {PersistConfig} from 'redux-persist/lib/types';
import {persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {RootState} from 'storeConfig/rootStore';
import {IResUser, IStateUser} from './types';
import {RESET_ALL_STATE} from 'storeConfig/types';
import * as typesAuth from 'scenes/auth/redux/types';
import {AuthActions} from 'scenes/auth/redux/slice';

type IAuthState = {
  userInfo: IStateUser | null;
};

const initialState: IAuthState = {
  userInfo: null,
};

// Slice
const key = 'data:account';
const accountSlice = createSlice({
  name: key,
  initialState,
  reducers: {
    setAccountSuccess: (state, action: PayloadAction<IResUser>) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
      };
    },
    updateAvatarSuccess: (state, action: PayloadAction<string>) => {
      if (state.userInfo) {
        state.userInfo = {
          ...state.userInfo,
          photo: action.payload,
        };
      }
    },
    setLocalAuthSuccess: (
      state,
      action: PayloadAction<typesAuth.IReqRegister>,
    ) => {
      state.userInfo = {
        ...state.userInfo,
        ...action.payload,
      };
    },
  },
  extraReducers: builder => {
    builder.addCase(AuthActions.logoutApp.type, () => {
      return initialState;
    });
    builder.addCase(RESET_ALL_STATE, () => {
      return initialState;
    });
  },
});

// Selectors
const getFullName = (state: RootState) => {
  if (
    state.data.account.userInfo?.firstname &&
    state.data.account.userInfo?.lastname
  )
    return `${state.data.account.userInfo?.firstname} ${state.data.account.userInfo?.lastname}`;
  return 'Meeter';
};
const getFirstName = (state: RootState) =>
  state.data.account.userInfo?.firstname;
const getLastName = (state: RootState) => state.data.account.userInfo?.lastname;
const getEmail = (state: RootState) => state.data.account.userInfo?.email;
const getAvatar = (state: RootState) => state.data.account.userInfo?.photo;
const getUserInfo = (state: RootState) => state.data.account.userInfo;
const getVerifyUser = (state: RootState) =>
  state.data.account.userInfo?.isVerify || false;
const getIdAuth = (state: RootState) => state.data.account.userInfo?.idAuth;
const getMeetpoint = (state: RootState) =>
  state.data.account.userInfo?.meetpoint || 0;
const getNumberOfMeet = (state: RootState) =>
  state.data.account.userInfo?.numberOfMeet || 0;
const getNumberOfEarn = (state: RootState) =>
  state.data.account.userInfo?.numberOfEarn || 0;
const getRefCode = (state: RootState) =>
  state.data?.account?.userInfo?.createdAtTimestamp?.toString();
export const AccountSelector = {
  getFullName,
  getAvatar,
  getUserInfo,
  getVerifyUser,
  getIdAuth,
  getFirstName,
  getLastName,
  getEmail,
  getMeetpoint,
  getNumberOfMeet,
  getNumberOfEarn,
  getRefCode,
};

// Actions
export const AccountActions = accountSlice.actions;

// Reducers
const persistConfig: PersistConfig<typeof initialState> = {
  key,
  storage: AsyncStorage,
};
export default persistReducer(persistConfig, accountSlice.reducer);
