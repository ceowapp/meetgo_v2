import useToast from 'components/Toast/useToast';
import {IResponseType, IStatus} from 'constant/commonType';
import {useState} from 'react';
import {AuthSelector} from 'scenes/auth/redux/slice';
import {useAppSelector} from 'storeConfig/hook';
import {
  apiCancelEarn,
  apiCheckEarn,
  apiGetLastEarn,
  apiHistoryEarn,
  apiStartEarn,
  apiVerifyEarn,
} from '../redux/api';
import {
  IDataEarn,
  IReqCancelEarn,
  IReqCheckEarn,
  IReqCurrentEarn,
  IReqCurrentShop,
  IReqStartEarn,
  IReqVerifyEarn,
} from '../redux/types';
import { useTranslation } from 'react-i18next';

const useEarn = (propsEarn?: IDataEarn) => {
  const { t } = useTranslation();
  const account = useAppSelector(AuthSelector.getAccount);
  const [dataEarn, setDataEarn] = useState<IDataEarn | undefined>(propsEarn);
  const [listDataEarn, setListDataEarn] = useState<IDataEarn[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const {addToast} = useToast();
  const startEarn = async (data: IReqCurrentShop) => {
    try {
      setLoading(true);
      const payload: IReqStartEarn = {
        account,
        ...data,
      };
      const result = await apiStartEarn(payload);
      if (result.data) {
        setDataEarn(result.data);
        if (errorMessage) {
          setErrorMessage('');
        }
      }
    } catch (error) {
      setErrorMessage(
        error?.status?.message || t('earn.locationError')
      );
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message: errorMess?.status?.message || t('earn.startError'),
        position: 'top',
        type: 'ERROR_V3',
      });
    } finally {
      setLoading(false);
    }
  };

  const checkEarn = async (data: IReqCurrentEarn) => {
    try {
      const payload: IReqCheckEarn = {
        account,
        ...data,
      };
      const result = await apiCheckEarn(payload);
      if (result.data && result.data.statusEarn === 'READY') {
        setErrorMessage('');
      } else {
        setErrorMessage(
          t('earn.locationWarning')
        );
      }
    } catch (error) {
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message: errorMess?.status?.message || t('earn.checkError'),
        position: 'top',
        type: 'ERROR_V3',
      });
      return false;
    }
  };

  const verifyEarn = async (data: IReqCurrentEarn): Promise<boolean> => {
    try {
      setLoading(true);
      const payload: IReqVerifyEarn = {
        account,
        ...data,
      };
      const result = await apiVerifyEarn(payload);
      return result.status.code === 200;
    } catch (error) {
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message: errorMess?.status?.message || t('earn.verifyError'),
        position: 'top',
        type: 'ERROR_V3',
      });
      setLoading(false);
      return false;
    }
  };

  const getLastEarn = async () => {
    const result = await apiGetLastEarn({account});
    if (result && result.data) {
      setDataEarn(result.data.earnDetail);
    }
    setDataEarn(undefined);
  };

  const cancelEarn = async (data: IReqCurrentEarn) => {
    try {
      setLoading(true);
      const payload: IReqCancelEarn = {
        account,
        ...data,
      };
      const result = await apiCancelEarn(payload);
      return result?.status?.code === 200;
    } catch (error) {
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message: errorMess?.status?.message || t('earn.cancelError'),
        position: 'top',
        type: 'ERROR_V3',
      });
    } finally {
      setLoading(false);
    }
  };

  const historyEarn = async () => {
    try {
      setLoading(true);
      const result = await apiHistoryEarn({account});
      if (result.data) {
        setListDataEarn(result.data);
      }
    } catch (error) {
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message: errorMess?.status?.message || t('earn.historyError'),
        position: 'top',
        type: 'ERROR_V3',
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    dataEarn,
    startEarn,
    checkEarn,
    verifyEarn,
    getLastEarn,
    cancelEarn,
    historyEarn,
    listDataEarn,
    errorMessage,
  };
};

export default useEarn;
