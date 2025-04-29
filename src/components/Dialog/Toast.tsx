import React, {FC} from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';

import CircleButton from 'components/CircleButton';
import {perWidth, resWidth} from 'utils/Screen';
import {hitSlop, padding} from 'utils/mixins';
import {TOAST_HEIGHT} from 'utils/sizes';
import {COLORS, SPACING} from 'utils/styleGuide';
import {Icon20px} from 'components/Icon/Icon';
import {Text} from 'react-native-paper';

interface Props {
  type:
    | 'ERROR_V3'
    | 'SUCCESS_V3'
    | 'INFO_V3'
    | 'LOST_NETWORK'
    | 'UNDO'
    | 'WARNING';

  message: string;
  name?: string;
  onHide?: () => void;
  hasClose?: boolean;
  IconLeft?: React.ReactNode | undefined;
  onPressRight?: () => void;
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: TOAST_HEIGHT,
    maxWidth: perWidth(90),
    borderRadius: resWidth(16),
    ...padding(SPACING.s_12, SPACING.m_16, SPACING.s_12, SPACING.m_16),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.red,
  },
  message: {
    color: COLORS.primaryWhite,
    marginHorizontal: SPACING.s_12,
    maxWidth: perWidth(70),
    textAlign: 'center',
  },
  lineBreak: {
    width: 1,
    height: resWidth(19),
    opacity: 0.3,
    backgroundColor: COLORS.primaryBlack,
  },
  textUndoRemove: {
    color: COLORS.primaryWhite,
    paddingLeft: SPACING.s_12,
  },
});

const Toast: FC<Props> = ({
  type,
  message,
  onHide,
  hasClose = true,
  name = '',
  IconLeft,
  onPressRight,
}) => {
  const getBackground = () => {
    switch (type) {
      case 'INFO_V3':
        return COLORS.orange;
      case 'ERROR_V3':
      case 'LOST_NETWORK':
        return COLORS.red;
      case 'UNDO':
        return COLORS.blue;
      default:
        return COLORS.green;
    }
  };

  const getIconBackground = () => {
    switch (type) {
      case 'INFO_V3':
        return COLORS.darkOrange;
      case 'ERROR_V3':
      case 'LOST_NETWORK':
        return COLORS.darkRed;
      case 'UNDO':
        return COLORS.transparent;
      default:
        return COLORS.darkGreen;
    }
  };

  const forceClose = () => {
    onHide && onHide();
  };

  const onPressRightToast = () => {
    onPressRight?.();
  };

  const renderIcon = () => {
    switch (type) {
      case 'INFO_V3':
        return <Icon20px.OutlineExclamationMark fill={COLORS.primaryWhite} />;
      case 'ERROR_V3':
        return <Icon20px.OutlineExclamationMark fill={COLORS.primaryWhite} />;
      case 'LOST_NETWORK':
        return <Icon20px.OutlineWifiOff fill={COLORS.primaryWhite} />;
      case 'UNDO':
        return IconLeft;
      default:
        return <Icon20px.OutlineCheckMark fill={COLORS.primaryWhite} />;
    }
  };

  const renderRight = React.useMemo((): React.ReactNode | undefined => {
    let compRight: React.ReactNode | undefined;
    switch (type) {
      case 'UNDO':
        compRight = (
          <>
            <View style={styles.lineBreak} />
            <TouchableOpacity
              hitSlop={hitSlop(SPACING.s_8)}
              onPress={onPressRightToast}>
              <Text style={styles.textUndoRemove}>Quay lại</Text>
            </TouchableOpacity>
          </>
        );
        break;
      default:
        if (hasClose) {
          compRight = (
            <CircleButton
              backgroundColor={getBackground()}
              size={resWidth(20)}
              onPress={forceClose}>
              <Icon20px.OutlineClose opacity={0.6} />
            </CircleButton>
          );
        }
    }
    return compRight;
  }, [type]);

  return (
    <View style={[styles.container, {backgroundColor: getBackground()}]}>
      <CircleButton
        backgroundColor={getIconBackground()}
        disabled
        size={resWidth(20)}>
        {renderIcon()}
      </CircleButton>
      <Text style={styles.message}>{message}</Text>
      {renderRight}
    </View>
  );
};

export default Toast;
