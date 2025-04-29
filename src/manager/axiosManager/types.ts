import {AxiosError, AxiosHeaderValue, AxiosResponse} from 'axios';
import {IResponseType} from 'constant/commonType';

export type Headers = {
  Accept: string;
  Authorization?: AxiosHeaderValue;
  'Content-Type': string;
  Platform: string;
  Version: string;
  DeviceId: string;
};
export type IResponseError = AxiosError<IResponseType<any>>;
