/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, {
  // AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import CONSTANTS from 'constant/appConstant';
import {ERROR_CODES} from 'constant/errorConstant';
import Platform from 'utils/Platform';
import * as types from './types';
import {IAuthToken} from 'scenes/auth/redux/types';
import authApi from 'scenes/auth/redux/api';

const TIMEOUT = 1 * 60 * 1000;
axios.defaults.timeout = TIMEOUT;

let interceptorsInstance = -1;

/**
 * setup axios included content-type & deviceId
 */

const init = (): void => {
  const headers: types.Headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
    Platform: Platform.OS,
    Version: Platform.appVersion,
    DeviceId: Platform.deviceId,
  };
  const auth = axios.defaults.headers.common.Authorization;
  if (auth) {
    headers.Authorization = auth;
  }
  axios.defaults.headers.common = headers;
};

/**
 * set baseUrl for axios
 * if in production environment, baseUrl alway from config
 *
 * else get from params
 *
 * TODO: This function look like weird and not consistency by the way output depend on environment values.
 * Need refactor it
 *
 * @param {String} baseUrl
 */
const setBaseUrl = (baseUrl: string): string => {
  let newBaseUrl = '';
  if (Platform.isBuildProduction) {
    newBaseUrl = CONSTANTS.API_URL.PRODUCTION;
  } else if (baseUrl) {
    newBaseUrl = baseUrl;
  }
  axios.defaults.baseURL = newBaseUrl;

  return newBaseUrl;
};

const clearBaseUrl = (): void => {
  axios.defaults.baseURL = '';
};

const setHeaderToken = (newToken: string): void => {
  if (!axios.defaults.headers || !newToken) {
    console.warn('-------- axios headers empty');
    return;
  }

  const bearerToken = `${newToken}`;
  const currentToken = axios.defaults.headers?.common?.Authorization || '';

  if (currentToken === bearerToken) {
    console.warn('-------- axios headers token SAME');
    return;
  }
  axios.defaults.headers.common.Authorization = bearerToken;
};

const clearHeaderToken = (): void => {
  axios.defaults.headers.common = {
    Accept: 'application/json',
    'Content-Type': 'application/json;charset=UTF-8',
    Platform: Platform.OS,
    Version: Platform.appVersion,
    DeviceId: Platform.deviceId,
  };
};

const removeHeaderAuthorize = (): void => {
  if (axios.defaults.headers?.common.Authorization) {
    delete axios.defaults.headers.common.Authorization;
  }
};

let isRefreshing = false;
let failedQueue: any = [];
let needToCancelRequest = false;

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(
    (prom: {
      reject: (arg0: any) => void;
      resolve: (arg0: string | null) => void;
    }) => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    },
  );

  failedQueue = [];
};

const setupOnResponseInterceptors = (
  onUpdateToken: (dataToken: IAuthToken) => void,
  onReLogin: () => void,
): void => {
  /**
   * handle error response
   */
  const onResponseError = async (
    errors: types.IResponseError,
  ): Promise<AxiosResponse<any>> => {
    const alertMessage = 'Không xác định';
    let dataErrorResponse: any;
    const {data} = errors.response || {};
    switch (data?.status?.code) {
      case ERROR_CODES.INTERNAL_SERVER_ERROR: {
        dataErrorResponse = errors.response?.data;
        dataErrorResponse.message = 'Lỗi sever';
        throw dataErrorResponse;
      }
      case ERROR_CODES.UNAUTHORIZED: {
        onReLogin();
        dataErrorResponse = errors.response?.data;
        dataErrorResponse.message = 'Refresh token hết hạn';
        throw dataErrorResponse;
      }
      case ERROR_CODES.EXPIRE_TOKEN: {
        let originalRequest = errors.config;
        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            failedQueue.push({resolve, reject});
          })
            .then((tokenNew: string) => {
              if (tokenNew !== '') {
                setHeaderToken(tokenNew);
                // @ts-ignore
                originalRequest.headers.Authorization =
                  axios.defaults.headers.common.Authorization;
                return axios.request(originalRequest).then(response => {
                  return response;
                });
              }
              throw new Error('token not found');
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }
        isRefreshing = true;
        try {
          const dataRefreshToken = await authApi.refreshToken();
          if (
            dataRefreshToken.status?.code === 200 &&
            dataRefreshToken?.data?.token
          ) {
            const tokenResponse: IAuthToken = {
              token: dataRefreshToken.data?.token || '',
              refreshToken: dataRefreshToken.data?.refreshToken,
            };
            onUpdateToken(tokenResponse);
            axios.defaults.headers.common.Authorization = `${tokenResponse.token}`;
            originalRequest.headers.Authorization =
              axios.defaults.headers.common.Authorization;
            processQueue(false, tokenResponse.token);
            isRefreshing = false;
            return axios.request(originalRequest).then(response => {
              return response;
            });
          }
        } catch (err) {
          processQueue(true, '');
          isRefreshing = false;
          throw err;
        }
        break;
      }
      default:
        dataErrorResponse = errors?.response?.data || {};
        dataErrorResponse.message = alertMessage;
        break;
    }

    throw dataErrorResponse;
  };

  /**
   * handle success response
   */

  const onResponseSuccess = (response: AxiosResponse): any => {
    return response?.data;
  };

  const onBeforeRequest = (config: InternalAxiosRequestConfig) => {
    const controller = new AbortController();
    if (!config?.headers?.common?.Authorization) {
      needToCancelRequest = false;
    }

    if (needToCancelRequest) controller.abort();
    return {
      ...config,
      signal: controller.signal,
    };
  };
  const onBeforeRequestError = (config: AxiosRequestConfig) => {
    return Promise.reject(config);
  };

  //@ts-ignore
  if (axios.interceptors.request?.handlers?.length < 1) {
    axios.interceptors.request.use(onBeforeRequest, onBeforeRequestError);
  }
  //@ts-ignore
  if (axios.interceptors.response?.handlers?.length < 1) {
    axios.interceptors.response.use(onResponseSuccess, onResponseError);
  }
};

const SetupAxios = {
  init,
  setBaseUrl,
  clearBaseUrl,
  setHeaderToken,
  clearHeaderToken,
  removeHeaderAuthorize,
  setupOnResponseInterceptors,
};

export default SetupAxios;
