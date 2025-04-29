import axios from 'axios';
import API_GLOBAL from 'constant/apiConstant';
import {IAccount, IResponseType} from 'constant/commonType';
import {
  IDataConnect,
  IReqCheckMeetAgain,
  IReqConfirmEndMeeting,
  IReqInvitedSendConfirm,
  IReqInviteUserOther,
  IReqLocationNearByMe,
  IReqPendingSuccess,
  IReqRejectMeeting,
  IResCheckMeetAgain,
  IResDataInvite,
  IResHistoryMeet,
  IResHistoryTransfer,
  IResLocationMeetNearByMe,
} from './types';

// api invite
const inviteMeetUser = (
  data: IReqInviteUserOther,
): Promise<IResponseType<IResDataInvite>> =>
  axios.post(API_GLOBAL.MEET.INVITE_USER_OTHER, data);

const pendingSuccess = (
  data: IReqPendingSuccess,
): Promise<IResponseType<any>> =>
  axios.post(API_GLOBAL.MEET.PENDING_SUCCESS, data);

const confirmEndMeeting = (
  data: IReqConfirmEndMeeting,
): Promise<IResponseType<any>> =>
  axios.post(API_GLOBAL.MEET.CONFIRM_END_MEETING, data);
// api invited
const invitedUserGetInfo = (
  data: IAccount,
): Promise<IResponseType<IDataConnect>> =>
  axios.post(API_GLOBAL.MEET.INVITED_USER_GET_INFO, data);
const invitedSendConfirm = (
  data: IReqInvitedSendConfirm,
): Promise<IResponseType<any>> =>
  axios.post(API_GLOBAL.MEET.INVITED_SEND_CONFIRM, data);
const rejectMeeting = (data: IReqRejectMeeting): Promise<IResponseType<any>> =>
  axios.post(API_GLOBAL.MEET.REJET_MEETING, data);

const getLastMeeting = (
  data: IAccount,
): Promise<IResponseType<IResDataInvite>> =>
  axios.post(API_GLOBAL.MEET.GET_LAST_MEETING, data);
const getLocationNearByMe = (
  data: IReqLocationNearByMe,
): Promise<IResponseType<IResLocationMeetNearByMe[]>> =>
  axios.post(API_GLOBAL.MEET.NEAR_BY_ME, data);

const getHistoryMeet = (
  data: IAccount,
): Promise<IResponseType<IResHistoryMeet[]>> =>
  axios.post(API_GLOBAL.MEET.HISTORY_MEET, data);

const getHistoryTransferPoint = (): Promise<
  IResponseType<IResHistoryTransfer[]>
> => axios.post(API_GLOBAL.HISTORY.TRANSFER_MEETPOINT);
const checkMeetAgain = (
  data: IReqCheckMeetAgain,
): Promise<IResponseType<IResCheckMeetAgain>> =>
  axios.post(API_GLOBAL.MEET.CHECK_MEET_AGAIN, data);
const meetApi = {
  inviteMeetUser,
  pendingSuccess,
  confirmEndMeeting,
  invitedUserGetInfo,
  invitedSendConfirm,
  rejectMeeting,
  getLastMeeting,
  getLocationNearByMe,
  getHistoryMeet,
  getHistoryTransferPoint,
  checkMeetAgain,
};
export default meetApi;
