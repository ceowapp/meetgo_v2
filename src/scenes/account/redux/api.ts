import axios from 'axios';
import API_GLOBAL from 'constant/apiConstant';
import {IAccount, IReqUser, IResponseType} from 'constant/commonType';
import {
  IResUser,
  IReqUpdateAvatar,
  IResUpdateAvatar,
  IReqUpdateUserInfo,
  IReqUpdateInfoKYC,
  IReqUploadImg,
  IResInfoKyc,
} from './types';

const getUserInfo = (data: IReqUser): Promise<IResponseType<IResUser>> =>
  axios.post(API_GLOBAL.ACCOUNT.GET_INFO, data);
const updateAvatar = (
  data: IReqUpdateAvatar,
): Promise<IResponseType<IResUpdateAvatar>> => {
  const formData = new FormData();
  formData.append('avatar', {
    uri: data.uri,
    name: data.fileName,
    type: data.type,
  });
  formData.append('account', data.account);
  return axios.post(API_GLOBAL.ACCOUNT.UPDATE_AVATAR, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
const apiUpdateUserInfo = (
  data: IReqUpdateUserInfo,
): Promise<IResponseType<null>> =>
  axios.put(API_GLOBAL.ACCOUNT.UPDATE_INFO, data);

const apiGetInfoKyc = (): Promise<IResponseType<IResInfoKyc>> =>
  axios.post(API_GLOBAL.VERIFY_ACCOUNT.GET_INFO_KYC);

const apiUpdateInfoKyc = (
  data: IReqUpdateInfoKYC,
): Promise<IResponseType<any>> =>
  axios.post(API_GLOBAL.VERIFY_ACCOUNT.UPDATE_INFO_KYC, data);
const apiUploadImgFrontId = (
  data: IReqUploadImg,
): Promise<IResponseType<any>> => {
  const formData = new FormData();
  formData.append('imageFrontID', {
    uri: data.uri,
    name: data.fileName,
    type: data.type,
  });
  return axios.post(API_GLOBAL.VERIFY_ACCOUNT.UPLOAD_IMG_FRONT_ID, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
const apiUploadImgBackId = (
  data: IReqUploadImg,
): Promise<IResponseType<any>> => {
  const formData = new FormData();
  formData.append('imageBackID', {
    uri: data.uri,
    name: data.fileName,
    type: data.type,
  });
  return axios.post(API_GLOBAL.VERIFY_ACCOUNT.UPLOAD_IMG_BACK_ID, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

const apiUploadImgKycWithId = (
  data: IReqUploadImg,
): Promise<IResponseType<any>> => {
  const formData = new FormData();
  formData.append('imageKycWithID', {
    uri: data.uri,
    name: data.fileName,
    type: data.type,
  });
  return axios.post(
    API_GLOBAL.VERIFY_ACCOUNT.UPLOAD_IMG_KYC_WITH_ID,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};

const apiApproveKyc = (): Promise<IResponseType<any>> =>
  axios.post(API_GLOBAL.VERIFY_ACCOUNT.APPROVE_KYC);
const apiDeleteAccount = (): Promise<IResponseType<any>> =>
  axios.post(API_GLOBAL.ACCOUNT.DELETE_ACCOUNT);
const getReferralList = (): Promise<IResponseType<IResUserReferrals>> =>
  axios.post(API_GLOBAL.ACCOUNT.GET_REFERRAL_LIST);

const accountApi = {
  getUserInfo,
  updateAvatar,
  apiUpdateUserInfo,
  apiGetInfoKyc,
  apiUpdateInfoKyc,
  apiUploadImgFrontId,
  apiUploadImgBackId,
  apiUploadImgKycWithId,
  apiApproveKyc,
  apiDeleteAccount,
  getReferralList
};
export default accountApi;
