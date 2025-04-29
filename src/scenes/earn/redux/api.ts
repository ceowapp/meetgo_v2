import axios from 'axios';
import API_GLOBAL from 'constant/apiConstant';
import {IResponseType} from 'constant/commonType';
import {
  IReqCancelEarn,
  IReqCheckEarn,
  IReqGetLastEarn,
  IReqHistoryEarn,
  IReqStartEarn,
  IReqVerifyEarn,
  IResCheckEarn,
  IResGetLastEarn,
  IResHistoryEarn,
  IResStartEarn,
} from './types';

const apiStartEarn = (
  data: IReqStartEarn,
): Promise<IResponseType<IResStartEarn>> =>
  axios.post(API_GLOBAL.EARN.START_EARN, data);

const apiCheckEarn = (
  data: IReqCheckEarn,
): Promise<IResponseType<IResCheckEarn>> =>
  axios.post(API_GLOBAL.EARN.CHECK_EARN, data);
const apiGetLastEarn = (
  data: IReqGetLastEarn,
): Promise<IResponseType<IResGetLastEarn>> =>
  axios.post(API_GLOBAL.EARN.GET_LAST_EARN, data);
const apiVerifyEarn = (data: IReqVerifyEarn): Promise<IResponseType<any>> =>
  axios.post(API_GLOBAL.EARN.VERIFY_EARN, data);
const apiCancelEarn = (data: IReqCancelEarn): Promise<IResponseType<any>> =>
  axios.post(API_GLOBAL.EARN.CANCEL_EARN, data);

const apiHistoryEarn = (
  data: IReqHistoryEarn,
): Promise<IResponseType<IResHistoryEarn>> =>
  axios.post(API_GLOBAL.EARN.HISTORY_EARN, data);

export {
  apiStartEarn,
  apiCheckEarn,
  apiGetLastEarn,
  apiVerifyEarn,
  apiCancelEarn,
  apiHistoryEarn,
};
