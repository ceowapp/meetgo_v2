import axios, {Axios} from 'axios';
import API_GLOBAL from 'constant/apiConstant';
import {IResponseType} from 'constant/commonType';
import {IFormOnboarding} from 'scenes/account/redux/types';
import storeConfig from 'storeConfig';
import {RootState} from 'storeConfig/rootStore';
import {AuthSelector} from './slice';
import {IAuthToken, IReqRegister, IResRegister} from './types';

async function refreshToken(): Promise<IResponseType<IAuthToken>> {
  const store: RootState = storeConfig.rootStore.getState();
  const refreshTokenApp = AuthSelector.getRefreshToken(store);
  if (refreshTokenApp !== '') {
    return axios.post(API_GLOBAL.AUTH.REFRESH_TOKEN, {
      refreshToken: refreshTokenApp,
    });
  }
  return Promise.reject({status: false, message: 'Refresh token not found'});
}

const registerUser = (
  data: IReqRegister,
): Promise<IResponseType<IResRegister>> =>
  axios.post(API_GLOBAL.AUTH.REGISTER, data);
const updateFirstSignUp = (
  data: IFormOnboarding,
): Promise<IResponseType<IResRegister>> =>
  axios.put(API_GLOBAL.AUTH.UPDATE_INFO_FIRST, data);

const authApi = {
  refreshToken,
  registerUser,
  updateFirstSignUp,
};
export default authApi;
