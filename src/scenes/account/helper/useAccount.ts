import useToast from 'components/Toast/useToast';
import {IResponseType, IStatus} from 'constant/commonType';
import {useState} from 'react';
import authApi from 'scenes/auth/redux/api';
import {AuthSelector} from 'scenes/auth/redux/slice';
import {IReqRegister} from 'scenes/auth/redux/types';
import {useAppDispatch, useAppSelector} from 'storeConfig/hook';
import {isValidResponse} from 'utils/Utility';
import accountApi from '../redux/api';
import {AccountActions} from '../redux/slice';
import {IDataImage, IFormOnboarding} from '../redux/types';
import { useTranslation } from 'react-i18next';

const useAccount = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const account = useAppSelector(AuthSelector.getAccount);
  const {addToast} = useToast();
  const dispatch = useAppDispatch();
  const getUserInfo = async (userParse?: IReqRegister) => {
    try {
      const resUser = await accountApi.getUserInfo({...userParse, account});
      if (isValidResponse(resUser)) {
        const userData = {
          ...userParse,
          ...resUser.data,
        };
        dispatch(AccountActions.setAccountSuccess(userData));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateAvatar = async (data: IDataImage) => {
    try {
      setLoading(true);
      const result = await accountApi.updateAvatar({...data, account});
      if (isValidResponse(result) && result?.data?.url) {
        dispatch(AccountActions.updateAvatarSuccess(result.data.url));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserInfo = async (
    data: Omit<IFormOnboarding, 'account'>,
    callbackSuccess?: () => void,
  ) => {
    try {
      setLoading(true);
      const result = await accountApi.apiUpdateUserInfo({...data, account});
      if (isValidResponse(result)) {
        addToast({
          message: t('account.status_update_success'),
          position: 'top',
        });
        callbackSuccess && callbackSuccess();
      }
    } catch (error) {
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message:
          errorMess.status.message || errorMess.message || t('account.status_update_fail'),
        position: 'top',
        type: 'ERROR_V3',
      });
    } finally {
      setLoading(false);
    }
  };
  const updateFirstSignup = async (
    data: IFormOnboarding,
    callbackSuccess?: () => void,
  ) => {
    try {
      setLoading(true);
      const result = await authApi.updateFirstSignUp(data);
      if (isValidResponse(result)) {
        addToast({
          message: t('account.status_update_success'),
          position: 'top',
        });
        callbackSuccess && callbackSuccess();
      }
    } catch (error) {
      console.log("this is error", error)
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message:
          errorMess.status.message || errorMess.message || t('account.status_update_fail'),
        position: 'top',
        type: 'ERROR_V3',
      });
    } finally {
      setLoading(false);
    }
  };
  return {
    getUserInfo,
    updateAvatar,
    updateUserInfo,
    updateFirstSignup,
    loading,
  };
};
export default useAccount;
