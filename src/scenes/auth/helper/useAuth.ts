import appleAuth, {
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import useToast from 'components/Toast/useToast';
import SetupAxios from 'manager/axiosManager';
import { navigateScreen } from 'navigation/RootNavigation';
import { STACK_NAVIGATOR } from 'navigation/types';
import { useState } from 'react';
import { AccountActions } from 'scenes/account/redux/slice';
import { useAppDispatch } from 'storeConfig/hook';
import { isValidResponse } from 'utils/Utility';
import authApi from '../redux/api';
import { AuthActions } from '../redux/slice';
import { IReqRegister } from '../redux/types';
import Config from 'react-native-config';
import Platform from 'utils/Platform';
import { IResponseType, IStatus } from 'constant/commonType';
import { jwtDecode } from "jwt-decode"
import config from 'react-native-config';
import DeepLink from 'services/deeplink';
import { useTranslation } from 'react-i18next';

const useAuth = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const { addToast } = useToast();

  const onSignInGoogle = async () => {
    try {
      setLoading(true);
      GoogleSignin.configure({
        webClientId: config.WEB_CLIENT_ID,
      });
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut();
      const googleResponse = await GoogleSignin.signIn();      
      if (googleResponse && googleResponse.data && googleResponse.data.user) {
        const userData = googleResponse.data.user;
        const idToken = googleResponse.data.idToken;
        const referralCode = await DeepLink.getReferralCode();
        const userParse: IReqRegister = {
          idAuth: userData.id,
          firstname: userData.familyName || '',
          lastname: userData.givenName || '',
          photo: userData.photo || '',
          email: userData.email || '',
          referral: referralCode,
          deviceID: Platform.deviceId,
          tokenId: idToken || '',
          platform: 'GOOGLE',
        };
        await useRegister(userParse);
        if (referralCode) {
          await DeepLink.clearReferralCode();
        }
      } else {
        setLoading(false);
        addToast({
          message: t('auth.loginFailed'),
          position: 'top',
          type: 'ERROR_V3',
        });
      }
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      if (error.code) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            console.log('User cancelled the login flow');
            break;
          case statusCodes.IN_PROGRESS:
            console.log('Sign in is in progress already');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Play services not available or outdated');
            break;
          default:
            console.log('Some other error happened:', error.message);
        }
      }
      const errorMess = error as IResponseType<IStatus>;
      addToast({
        message:
          errorMess?.status?.message ||
          errorMess.message ||
          t('auth.loginFailed'),
        position: 'top',
        type: 'ERROR_V3',
      });
    } finally {
      setLoading(false);
    }
  };

  const useRegister = async (userParse: IReqRegister) => {
    const result = await authApi.registerUser(userParse);
    if (isValidResponse(result) && result.data.account) {
      const dataToken = {
        token: result.data.token,
        refreshToken: result.data.refreshToken,
      };
      dispatch(AuthActions.updateCoupleToken(dataToken));
      dispatch(AuthActions.setAccount(result.data.account));
      SetupAxios.setHeaderToken(dataToken.token);
      addToast({
        message: t('auth.registerSuccess'),
        position: 'top',
      });
      if (!result.data.isSignUp) {
        dispatch(AuthActions.setRegisterSuccess());
        addToast({
          message: t('auth.loginSuccess'),
          position: 'top',
        });
      } else {
        dispatch(AccountActions.setLocalAuthSuccess(userParse));
        navigateScreen(STACK_NAVIGATOR.AUTHEN_ONBOARD);
        addToast({
          message: t('auth.registerSuccess'),
          position: 'top',
        });
      }
    }
  };

  const onSiginAndroidApple = async () => {
    try {
      setLoading(true);
      appleAuthAndroid.configure({
        clientId: Config.IDENTIFER_LOGIN_ANDROID || '',
        redirectUri: Config.DOMAIN_LOGIN_CALLBACK || '',
        responseType: appleAuthAndroid.ResponseType.ALL,
        scope: appleAuthAndroid.Scope.ALL,
      });
      const response = await appleAuthAndroid.signIn();
      if (response && response.id_token) {
        const dataJwt = jwtDecode(response.id_token) as {
          iss: string;
          sub: string;
          email: string;
        };
        if (dataJwt?.sub) {
          const referralCode = await DeepLink.getReferralCode();
          const userParse: IReqRegister = {
            idAuth: dataJwt.sub,
            firstname: response?.user?.name?.firstName || '',
            lastname: response?.user?.name?.lastName || '',
            email: response?.user?.email || '',
            photo: '',
            referral: referralCode,
            deviceID: Platform.deviceId,
            tokenId: response.id_token || '',
            platform: 'APPLE_ANDROID',
          };
          await useRegister(userParse);
          if (referralCode) {
            await DeepLink.clearReferralCode();
          }
        } else {
          addToast({
            message: t('auth.loginFailed'),
            position: 'top',
            type: 'ERROR_V3',
          });
        }
      } else {
        addToast({
          message: t('auth.loginFailed'),
          position: 'top',
          type: 'ERROR_V3',
        });
      }
    } catch (err) {
      const errorMess = err as IResponseType<IStatus>;
      addToast({
        message:
          errorMess?.status?.message ||
          errorMess.message ||
          t('auth.loginFailed'),
        position: 'top',
        type: 'ERROR_V3',
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onSignInApple = async () => {
    try {
      setLoading(true);
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );
      if (credentialState === appleAuth.State.AUTHORIZED) {
        const referralCode = await DeepLink.getReferralCode();
        const userParse: IReqRegister = {
          idAuth: appleAuthRequestResponse.user,
          firstname: appleAuthRequestResponse.fullName?.familyName || '',
          lastname: appleAuthRequestResponse.fullName?.givenName || '',
          email: appleAuthRequestResponse.email || '',
          photo: '',
          referral: referralCode,
          deviceID: Platform.deviceId,
          tokenId: appleAuthRequestResponse.identityToken || '',
          platform: 'APPLE',
        };
        await useRegister(userParse);
        if (referralCode) {
          await DeepLink.clearReferralCode();
        }
      } else {
        addToast({
          message: t('auth.loginFailed'),
          position: 'top',
          type: 'ERROR_V3',
        });
        setLoading(false);
      }
    } catch (err) {
      const errorMess = err as IResponseType<IStatus>;
      addToast({
        message:
          errorMess?.status?.message ||
          errorMess.message ||
          t('auth.loginFailed'),
        position: 'top',
        type: 'ERROR_V3',
      });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    onSignInGoogle,
    onSignInApple,
    onSiginAndroidApple,
    loading,
  };
};

export default useAuth;


