import useToast from 'components/Toast/useToast';
import {IResponseType, IStatus} from 'constant/commonType';
import {useState} from 'react';
import {isValidResponse} from 'utils/Utility';
import accountApi from '../redux/api';
import {IDataImage, IReqUpdateInfoKYC, IResInfoKyc} from '../redux/types';

const useAccountKyc = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [infoKyc, setInfoKyc] = useState<IResInfoKyc>();
  const {addToast} = useToast();
  const getInfoKyc = async () => {
    try {
      const result = await accountApi.apiGetInfoKyc();
      if (isValidResponse(result) && result.data) {
        setInfoKyc(result.data);
      }
    } catch (error) {
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message: errorMess?.status?.message || errorMess.message || '',
        position: 'top',
        type: 'ERROR_V3',
      });
      console.error(error);
    }
  };
  const updateInfoKyc = async (
    data: IReqUpdateInfoKYC,
    callback: ({status}: {status: boolean}) => void,
  ) => {
    try {
      setLoading(true);
      const result = await accountApi.apiUpdateInfoKyc(data);
      if (isValidResponse(result)) {
        callback({status: true});
      }
    } catch (error) {
      console.error(error);
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message: errorMess?.status?.message || errorMess.message || '',
        position: 'top',
        type: 'ERROR_V3',
      });
    } finally {
      callback({status: true});
      setLoading(false);
    }
  };
  const uploadImgFrontId = async (
    data: IDataImage,
    callback: ({status}: {status: boolean}) => void,
  ) => {
    try {
      setLoading(true);
      const result = await accountApi.apiUploadImgFrontId(data);
      if (isValidResponse(result)) {
        callback({status: true});
      }
    } catch (error) {
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message: errorMess?.status?.message || errorMess.message || '',
        position: 'top',
        type: 'ERROR_V3',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const uploadImgBackId = async (
    data: IDataImage,
    callback: ({status}: {status: boolean}) => void,
  ) => {
    try {
      setLoading(true);
      const result = await accountApi.apiUploadImgBackId(data);
      if (isValidResponse(result)) {
        callback({status: true});
      }
    } catch (error) {
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message: errorMess?.status?.message || errorMess.message || '',
        position: 'top',
        type: 'ERROR_V3',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const uploadImgKycWithId = async (
    data: IDataImage,
    callback: ({status}: {status: boolean}) => void,
  ) => {
    try {
      setLoading(true);
      const result = await accountApi.apiUploadImgKycWithId(data);
      if (isValidResponse(result)) {
        callback({status: true});
      }
    } catch (error) {
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message: errorMess?.status?.message || errorMess.message || '',
        position: 'top',
        type: 'ERROR_V3',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const approveKyc = async (
    callback: ({status}: {status: boolean}) => void,
  ) => {
    try {
      setLoading(true);
      const result = await accountApi.apiApproveKyc();
      if (isValidResponse(result)) {
        callback({status: true});
      }
    } catch (error) {
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message: errorMess?.status?.message || errorMess.message || '',
        position: 'top',
        type: 'ERROR_V3',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    getInfoKyc,
    updateInfoKyc,
    uploadImgFrontId,
    uploadImgBackId,
    uploadImgKycWithId,
    approveKyc,
    loading,
    infoKyc,
  };
};
export default useAccountKyc;
