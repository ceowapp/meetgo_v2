import DialogModal from 'components/BaseModal/DialogModal';
import React, {useImperativeHandle, useRef, useState} from 'react';
import {modalRef} from './modalHandler';
import * as types from './types';

const MODAL_LIST = {
  [types.DIALOG_MODAL]: DialogModal,
  [types.DIALOG_EARN_MODAL]: DialogModal,
  [types.DIALOG_MEET_MODAL]: DialogModal,
};
const GlobalModal = (): React.ReactElement => {
  const [isVisible, setIsVisible] = useState(false);
  const [modalProps, setModalProps] = useState<types.ModalsProps>();
  const type = useRef<types.TYPEMODAL>();
  const modalName = useRef<types.IDialogModalName>();

  const hide = (props: types.HideModalProps = {}) => {
    // allow hide modal with type FORCE
    if (modalProps?.type === 'FORCE' && props?.type !== 'FORCE') {
      return;
    }

    setIsVisible(false);
    setModalProps(null);
  };

  const show = (props: types.ModalsGlobalProps) => {
    // current show modal FORCE then dont allow show another modal
    const isForceModal = modalProps?.type === 'FORCE' && isVisible;
    if (isForceModal) {
      // allow hide modal with type FORCE
      return;
    }
    type.current = props?.type;
    modalName.current = props?.modalName;
    setModalProps(props?.modalProps);
    setIsVisible(true);
  };

  useImperativeHandle(modalRef, () => ({
    hideModal: hide,
    showModal: show,
    getVisibleModal: () => isVisible,
    getModalName: () => modalName.current,
  }));
  const Modal = modalName.current ? MODAL_LIST[modalName.current] : undefined;
  if (type.current === types.TYPEMODAL.MODAL && modalProps && Modal) {
    return <Modal hideModal={hide} isVisible={isVisible} {...modalProps} />;
  }
  return <></>;
};
export default GlobalModal;
