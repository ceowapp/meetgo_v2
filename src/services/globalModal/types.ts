import {IDialogModalProps} from 'components/BaseModal/DialogModal';

export enum TYPEMODAL {
  BOTTOM = 'BOTTOM',
  MODAL = 'MODAL',
}
export const DIALOG_MODAL = 'DIALOG_MODAL';
export const DIALOG_EARN_MODAL = 'DIALOG_EARN_MODAL';
export const DIALOG_MEET_MODAL = 'DIALOG_MEET_MODAL';
export type ModalsProps = IDialogModalProps | null;

export type IDialogModalName =
  | typeof DIALOG_MODAL
  | typeof DIALOG_EARN_MODAL
  | typeof DIALOG_MEET_MODAL;
export type ModalsGlobalProps = {
  modalName: IDialogModalName;
  modalProps?: ModalsProps;
  type: TYPEMODAL;
};

export type HideModalProps = {
  callbackHide?: () => void;
  type?: 'FORCE';
};
