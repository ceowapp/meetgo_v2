import {combineReducers} from '@reduxjs/toolkit';
import servicesReducer from './servicesReducer';
import dataReducer from './dataReducer';

const appReducer = combineReducers({
  services: servicesReducer,
  data: dataReducer,
});
export default appReducer;
