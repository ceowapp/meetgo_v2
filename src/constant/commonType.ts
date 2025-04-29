export type IStatus = {
  message: string;
  code: 200 | 201 | 400 | 401 | 440 | 500;
  success: boolean;
};
export type IMeta = {
  currentPage: number;
  totalPages: number;
  totalRows: number;
};
export interface IResponseType<T> {
  isSuccess: boolean;
  status: IStatus;
  data: T;
  meta?: IMeta;
  message?: string;
}
export type IReqUser = {
  account: string;
};

export enum IStatusMeet {
  PENDING = 'PENDING',
  DONE = 'DONE',
  INVITE_REJECT = 'INVITE_REJECT',
  INVITED_REJECT = 'INVITED_REJECT',
  INVITE_FAIL = 'INVITE_FAIL',
  INVITED_FAIL = 'INVITED_FAIL',
  PENDING_SUCCESS = 'PENDING_SUCCESS',
  READY = 'READY',
  FAIL = 'FAIL',
}

export type IAccount = {
  account: string;
};
