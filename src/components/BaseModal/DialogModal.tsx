import React, {FC, ReactElement} from 'react';
import {StyleSheet, View} from 'react-native';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import Modal from 'react-native-modal';
import renderNode from 'utils/NodeView';
import Platform from 'utils/Platform';
import {perHeight} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import {Text} from 'react-native-paper';

export interface IDialogModalProps {
  content: (() => ReactElement) | string | React.ReactText[] | null;
  isVisible?: boolean;
  callbackHide?: () => void;
  hideModal?: () => void;
  type?: 'FORCE';
}

const styles = StyleSheet.create({
  modalOverride: {
    marginHorizontal: SPACING.m_16,
  },
});

const deviceHeight = Platform.isIos
  ? perHeight(100)
  : ExtraDimensions.getRealWindowHeight();

const DialogModal: FC<IDialogModalProps> = ({
  content,
  isVisible,
  callbackHide,
  hideModal,
  ...rest
}): ReactElement => {
  const onHide = () => {
    callbackHide && callbackHide();
  };
  return (
    <Modal
      onModalHide={onHide}
      isVisible={isVisible}
      useNativeDriver
      backdropColor={COLORS.primaryBlack}
      backdropOpacity={0.8}
      animationIn="fadeIn"
      animationOut="fadeOut"
      hideModalContentWhileAnimating
      statusBarTranslucent
      useNativeDriverForBackdrop
      deviceHeight={deviceHeight}
      style={styles.modalOverride}
      {...rest}>
      {content && renderNode(Text, content)}
    </Modal>
  );
};

export default DialogModal;
