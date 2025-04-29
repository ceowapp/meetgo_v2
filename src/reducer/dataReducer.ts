import {combineReducers} from '@reduxjs/toolkit';
import AuthReducer from 'scenes/auth/redux/slice';
import AccountReducer from 'scenes/account/redux/slice';
export default combineReducers({
  auth: AuthReducer,
  account: AccountReducer,
});
