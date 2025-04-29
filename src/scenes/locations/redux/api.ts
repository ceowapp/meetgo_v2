import axios from 'axios';
import API_GLOBAL from 'constant/apiConstant';
import {IResponseType} from 'constant/commonType';
import {
  IReqAddressDetail,
  IReqLocationSearch,
  IReqNearByMap,
  IReqNearByMe,
  IResAddressDetail,
  IResLocationSearch,
  IResNearByMap,
  IResNearByMe,
} from './type';

const getLocationNearByMe = (
  data: IReqNearByMe,
): Promise<IResponseType<IResNearByMe[]>> =>
  axios.post(API_GLOBAL.LOCATION.NEAR_BY_ME, data);

const getLocationNearByMap = (
  data: IReqNearByMap,
): Promise<IResponseType<IResNearByMap[]>> =>
  axios.post(API_GLOBAL.LOCATION.NEAR_BY_MAP, data);

const searchLocationNearByMe = (
  data: IReqLocationSearch,
): Promise<IResponseType<IResLocationSearch[]>> =>
  axios.post(API_GLOBAL.LOCATION.SEARCH, data);

const getLocationDetail = (
  data: IReqAddressDetail,
): Promise<IResponseType<IResAddressDetail>> =>
  axios.post(API_GLOBAL.LOCATION.ADDRESS_DETAIL, data);

const locationApi = {
  getLocationNearByMe,
  getLocationNearByMap,
  searchLocationNearByMe,
  getLocationDetail,
};
export default locationApi;
