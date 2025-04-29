import useToast from 'components/Toast/useToast';
import {IResponseType, IStatus} from 'constant/commonType';
import {useState} from 'react';
import {AuthSelector} from 'scenes/auth/redux/slice';
import {ILocation} from 'scenes/locations/redux/type';
import {useAppSelector} from 'storeConfig/hook';
import {isValidResponse} from 'utils/Utility';
import meetApi from '../redux/api';
import {
  IDataConnect,
  IReqCheckMeetAgain,
  IReqConfirmEndMeeting,
  IReqInvitedSendConfirm,
  IReqInviteUserOther,
  IReqPendingSuccess,
  IReqRejectMeeting,
  IResCheckMeetAgain,
  IResHistoryMeet,
  IResHistoryTransfer,
  IResLocationMeetNearByMe,
  IDataFakeLocation,
} from '../redux/types';
import { useTranslation } from 'react-i18next';

export const useMeet = () => {
  const { t } = useTranslation();
  const {addToast} = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [connectId, setConnectId] = useState<string>('');
  const account = useAppSelector(AuthSelector.getAccount);
  const [listLocationNearBy, setListLocationNearBy] = useState<
    IResLocationMeetNearByMe[]
  >([]);
  const [listHistoryMeet, setListHistoryMeet] = useState<IResHistoryMeet[]>([]);
  const [listHistoryTransfer, setListHistoryTransfer] = useState<
    IResHistoryTransfer[]
  >([]);
  const [dataHistoryOlderMeet, setDataHistoryOlderMeet] =
    useState<IResCheckMeetAgain>();
  const inviteMeetUser = async (
    accountConnect: string,
    currentLat: number,
    currentLong: number,
    dataFakeLocation: IDataFakeLocation | null,
  ) => {
    try {
      setLoading(true);
      const dataPayload: IReqInviteUserOther = {
        account,
        accountConnect,
        latitudeNFT: listLocationNearBy[0]?.latitude,
        longtitudeNFT: listLocationNearBy[0]?.longitude,
        currentLat,
        currentLong,
        addressNFT: listLocationNearBy[0]?.address || '',
        locationID: listLocationNearBy[0]?.id || '',
        ...dataFakeLocation,
      };
      const result = await meetApi.inviteMeetUser(dataPayload);
      if (isValidResponse(result)) {
        setConnectId(result.data?.connectId?.connectId);
      }
    } catch (error) {
      const err = error as IResponseType<IStatus>;
      addToast({
        message:
          err?.status.message ||
          err?.message ||
          t('meets.inviteFailed'),
        position: 'top',
        type: 'ERROR_V3',
      });
    } finally {
      setLoading(false);
    }
  };

  const sendPendingSuccess = async (dataPayload: IReqPendingSuccess) => {
    meetApi.pendingSuccess(dataPayload);
  };

  const confimEndMeeting = async (
    dataPayload: IReqConfirmEndMeeting,
  ): Promise<boolean> => {
    try {
      const result = await meetApi.confirmEndMeeting(dataPayload);
      if (isValidResponse(result)) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  };

  const getInfoInvite = async (): Promise<IDataConnect | null> => {
    try {
      const result = await meetApi.invitedUserGetInfo({account});
      if (isValidResponse(result)) {
        return result.data;
      }
      return null;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const sendConfirmInvited = async (dataPayload: IReqInvitedSendConfirm) => {
    try {
      const result = await meetApi.invitedSendConfirm(dataPayload);
      if (isValidResponse(result)) {
        return {
          status: true,
          message: '',
        };
      }
      return {
        status: false,
        message: t('meets.confirmInviteFailed'),
      };
    } catch (error) {
      const err = error as IResponseType<IStatus>;
      return {
        status: false,
        message:
          err?.status?.message || err.message || t('meets.confirmInviteFailed'),
      };
    }
  };

  const rejectInvited = async (dataPayload: IReqRejectMeeting) => {
    try {
      const result = await meetApi.rejectMeeting(dataPayload);
      if (isValidResponse(result)) {
        return true;
      }
      addToast({
        message: t('meets.rejectFailed'),
        type: 'ERROR_V3',
        position: 'top',
      });
      return false;
    } catch (error) {
      console.error(error);
      const err = error as IResponseType<IStatus>;
      addToast({
        message:
          err?.status?.message ||
          err?.message ||
          t('meets.rejectFailed'),
        type: 'ERROR_V3',
        position: 'top',
      });
      return false;
    }
  };

  const getLastMeeting = async () => {
    try {
      const result = await meetApi.getLastMeeting({account});
      if (isValidResponse(result)) {
        return result.data;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getListLocationMeetNearByMe = async (location: ILocation) => {
    try {
      const result = await meetApi.getLocationNearByMe({
        currentLat: location.latitude,
        currentLong: location.longitude,
      });
      if (isValidResponse(result)) {
        setListLocationNearBy(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getHistoryMeet = async () => {
    try {
      setLoading(true);
      const result = await meetApi.getHistoryMeet({account});
      if (isValidResponse(result)) {
        setListHistoryMeet(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getHistoryTransferPoint = async () => {
    try {
      setLoading(true);
      const result = await meetApi.getHistoryTransferPoint();
      if (isValidResponse(result)) {
        setListHistoryTransfer(result.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const checkMeetAgain = async (accountConnect: string) => {
    try {
      const payload: IReqCheckMeetAgain = {
        account,
        accountConnect,
      };
      const result = await meetApi.checkMeetAgain(payload);
      if (isValidResponse(result)) {
        setDataHistoryOlderMeet(result.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    inviteMeetUser,
    sendPendingSuccess,
    confimEndMeeting,
    loading,
    connectId,
    getInfoInvite,
    sendConfirmInvited,
    rejectInvited,
    getLastMeeting,
    getListLocationMeetNearByMe,
    listLocationNearBy,
    getHistoryMeet,
    listHistoryMeet,
    account,
    getHistoryTransferPoint,
    listHistoryTransfer,
    checkMeetAgain,
    dataHistoryOlderMeet,
  };
};
