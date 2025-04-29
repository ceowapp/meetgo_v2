import {IDialogModalProps} from 'components/BaseModal/DialogModal';
import React from 'react';
import * as types from './types';

export const modalRef = React.createRef<IModal>();

export interface IModal {
  showModal: typeof showModal;
  hideModal: typeof hideModal;
  getVisibleModal: () => boolean;
  getModalName: () => types.IDialogModalName | undefined;
}
export const showModal = (props: types.ModalsGlobalProps): void =>
  modalRef.current?.showModal?.(props);

export const hideModal = (props: types.HideModalProps = {}): void =>
  modalRef.current?.hideModal?.(props);
export const showDialogModal = (props: IDialogModalProps): void => {
  const dataModal: types.ModalsGlobalProps = {
    modalName: types.DIALOG_MODAL,
    type: types.TYPEMODAL.MODAL,
    modalProps: props,
  };
  return showModal(dataModal);
};

export const showEarnModal = (props: IDialogModalProps): void => {
  const dataModal: types.ModalsGlobalProps = {
    modalName: types.DIALOG_EARN_MODAL,
    type: types.TYPEMODAL.MODAL,
    modalProps: props,
  };
  return showModal(dataModal);
};
export const showMeetModal = (props: IDialogModalProps): void => {
  const dataModal: types.ModalsGlobalProps = {
    modalName: types.DIALOG_MEET_MODAL,
    type: types.TYPEMODAL.MODAL,
    modalProps: props,
  };
  return showModal(dataModal);
};
