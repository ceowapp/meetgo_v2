import {Action, createAction} from '@reduxjs/toolkit';
import rootStore from 'storeConfig/rootStore';

export const RESET_ALL_STATE = createAction('RESET_ALL_STATE');

export type AppDispatch = typeof rootStore.dispatch;
export interface IRootStoreActions {
  type: typeof RESET_ALL_STATE.type;
}

export interface IAction<TYPE, PAYLOAD = undefined> extends Action<TYPE> {
  payload?: PAYLOAD;
}
