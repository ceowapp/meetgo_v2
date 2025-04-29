import {combineReducers} from '@reduxjs/toolkit';
import settingsReducer from 'services/settings/slice';
import netWorkReducer from 'services/networkInfo/slice';
import appstateReducer from 'services/appstate/slice';
import locationReducer from 'services/location/slice';

export default combineReducers({
  settings: settingsReducer,
  network: netWorkReducer,
  appstate: appstateReducer,
  location: locationReducer,
});
