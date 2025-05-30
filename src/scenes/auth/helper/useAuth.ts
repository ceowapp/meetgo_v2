import appleAuth, {
  appleAuthAndroid,
} from '@invertase/react-native-apple-authentication';
import 'react-native-get-random-values';
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
import { decode } from 'base-64';
import { jwtDecode } from "jwt-decode"
import config from 'react-native-config';
import DeepLink from 'services/deeplink';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';

global.atob = decode;

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
    try {
      const result = await authApi.registerUser(userParse);
      if (isValidResponse(result) && result.data.account) {
        const dataToken = {
          token: result.data.token,
          refreshToken: result.data.refreshToken,
        };
        dispatch(AuthActions.updateCoupleToken(dataToken));
        dispatch(AuthActions.setAccount(result.data.account));
        SetupAxios.setHeaderToken(dataToken.token);
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
      } else {
        console.error('Registration failed - Invalid response or missing account data:', result);
        const errorMessage = result?.data?.message || 
                            result?.message || 
                            result?.status?.message || 
                            t('auth.registerFailed') || 
                            'Registration failed';
        addToast({
          message: errorMessage,
          position: 'top',
          type: 'ERROR_V3',
        });
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Registration error:', error);
      let errorMessage = t('auth.registerFailed') || 'Registration failed';
      if (error && typeof error === 'object') {
        const errorObj = error as IResponseType<IStatus>;
        if (errorObj.status?.message) {
          errorMessage = errorObj.status.message;
        } else if (errorObj.message) {
          errorMessage = errorObj.message;
        } else if (errorObj.data?.message) {
          errorMessage = errorObj.data.message;
        }
        else if (error.name === 'NetworkError' || error.message?.includes('Network')) {
          errorMessage = t('auth.networkError') || 'Network error. Please check your connection.';
        }
        else if (error.message?.includes('timeout')) {
          errorMessage = t('auth.timeoutError') || 'Request timeout. Please try again.';
        }
      }
      addToast({
        message: errorMessage,
        position: 'top',
        type: 'ERROR_V3',
      });
      throw error;
    }
  };

  const onSiginAndroidApple = async () => {
    try {
      setLoading(true);
      const rawNonce = uuidv4();
      const state = uuidv4();
      appleAuthAndroid.configure({
        clientId: Config.IDENTIFER_LOGIN_ANDROID || '',
        redirectUri: Config.DOMAIN_LOGIN_CALLBACK || '',
        responseType: appleAuthAndroid.ResponseType.ALL,
        scope: appleAuthAndroid.Scope.ALL,
        nonce: rawNonce,
        state
      });
      const response = await appleAuthAndroid.signIn();
      if (response) {
        const { code, id_token, user, state: responseState } = response;      
        if (id_token) {
          let dataJwt;
          try {
            if (typeof id_token !== 'string' || !id_token.includes('.')) {
              throw new Error('Invalid JWT token format');
            }
            dataJwt = jwtDecode(id_token) as {
              iss: string;
              sub: string;
              email: string;
              email_verified?: boolean;
            };
            console.log('Successfully decoded JWT:', dataJwt);
          } catch (jwtDecodeError) {
            console.error('Failed to decode JWT:', jwtDecodeError);
            console.error('Token that failed to decode:', id_token);
            addToast({
              message: t('auth.loginFailed'),
              position: 'top',
              type: 'ERROR_V3',
            });
            return;
          }
          if (dataJwt?.sub) {
            try {
              const referralCode = await DeepLink.getReferralCode();
              const firstName = user?.name?.firstName || '';
              const lastName = user?.name?.lastName || '';
              const userEmail = user?.email || dataJwt?.email || '';
              const userParse: IReqRegister = {
                idAuth: dataJwt.sub,
                firstname: firstName,
                lastname: lastName,
                email: userEmail,
                photo: '',
                referral: referralCode,
                deviceID: Platform.deviceId,
                tokenId: id_token,
                platform: 'APPLE_ANDROID',
              };
              await useRegister(userParse);
              if (referralCode) {
                await DeepLink.clearReferralCode();
              }
            } catch (registrationError) {
              const errorMess = registrationError as IResponseType<IStatus>;
              if (errorMess?.status?.message || errorMess?.message) {
                addToast({
                  message: errorMess?.status?.message || errorMess?.message,
                  position: 'top',
                  type: 'ERROR_V3',
                });
              }
            }
          } else {
            console.error('No subject (sub) found in JWT');
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
      } else {
        addToast({
          message: t('auth.loginFailed'),
          position: 'top',
          type: 'ERROR_V3',
        });
      }
    } catch (err) {    
      if (err && typeof err === 'object' && 'message' in err) {
        switch (err.message) {
          case appleAuthAndroid.Error.NOT_CONFIGURED:
            addToast({
              message: t('auth.configurationError') || 'Configuration error',
              position: 'top',
              type: 'ERROR_V3',
            });
            break;
          case appleAuthAndroid.Error.SIGNIN_FAILED:
            addToast({
              message: t('auth.loginFailed'),
              position: 'top',
              type: 'ERROR_V3',
            });
            break;
          case appleAuthAndroid.Error.SIGNIN_CANCELLED:
            console.log("User cancelled Apple signin.");
            break;
          default:
            const errorMess = err as IResponseType<IStatus>;
            addToast({
              message:
                errorMess?.status?.message ||
                errorMess.message ||
                t('auth.loginFailed'),
              position: 'top',
              type: 'ERROR_V3',
            });
            break;
        }
      } else {
        addToast({
          message: t('auth.loginFailed'),
          position: 'top',
          type: 'ERROR_V3',
        });
      }
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
      const {
        user: newUser,
        email,
        fullName,
        identityToken,
        nonce,
        realUserStatus
      } = appleAuthRequestResponse;
      const credentialState = await appleAuth.getCredentialStateForUser(newUser);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        let userEmail = email || 'unknown';
        let displayName = 'unknown';
        if (fullName && fullName.givenName && fullName.familyName) {
          displayName = `${fullName.givenName} ${fullName.familyName}`;
        }
        if (identityToken && userEmail === 'unknown') {
          try {
            const decoded = jwtDecode(identityToken);
            console.log('decoded token: ', decoded);
            if (decoded.email) {
              userEmail = decoded.email;
            }
          } catch (decodeError) {
            console.error('JWT decode error:', decodeError);
          }
        }
        if (realUserStatus === appleAuth.UserStatus.LIKELY_REAL) {
          console.log("User is likely a real person!");
        }
        if (identityToken) {
          const referralCode = await DeepLink.getReferralCode();
          const userParse = {
            idAuth: newUser,
            firstname: fullName?.familyName || '',
            lastname: fullName?.givenName || '',
            email: userEmail !== 'unknown' ? userEmail : '',
            photo: '',
            referral: referralCode,
            deviceID: Platform.deviceId,
            tokenId: identityToken,
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
        }
      } else {
        addToast({
          message: t('auth.loginFailed'),
          position: 'top',
          type: 'ERROR_V3',
        });
      }
    } catch (err) {      
      if (err.code === appleAuth.Error.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        const errorMess = err;
        addToast({
          message:
            errorMess?.status?.message ||
            errorMess.message ||
            t('auth.loginFailed'),
          position: 'top',
          type: 'ERROR_V3',
        });
      }
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




