import React, {PropsWithChildren, useEffect, useMemo} from 'react';
import {Animated, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
/** Components */
import ToastV3 from 'components/Dialog/Toast';
/** Others */
import {resWidth} from 'utils/Screen';
import styles from './styles';
import {ToastProps} from './types';
import colors from 'services/themes/colors';
import {Text} from 'react-native-paper';

export enum ToastType {
  Info = 'INFO',
  Error = 'ERROR',
  Success = 'SUCCESS',
  InfoV3 = 'INFO_V3',
  ErrorV3 = 'ERROR_V3',
  SuccessV3 = 'SUCCESS_V3',
  Sharing = 'SHARING',
  Undo = 'UNDO',
}

const DEFAULT_TOP_SPACING = resWidth(16);
const DEFAULT_BOTTOM_SPACING = resWidth(30);
const Toast: React.FC<PropsWithChildren<ToastProps>> = ({
  type = ToastType.Success,
  children,
  IconRight,
  IconLeft,
  animateDuration = 300,
  hideMyself,
  hideAfter = 3000,
  position,
  stylesContainer,
  dynamicBottomPosition,
  name = '',
  onPressRight,
}) => {
  const {top, bottom} = useSafeAreaInsets();
  const opacity = React.useRef(new Animated.Value(0)).current;
  const backgroundColor = useMemo<string>(() => {
    switch (type) {
      case ToastType.Info:
        return colors.primary;
      case ToastType.Error:
        return colors.error;
      case ToastType.Success:
        return colors.greenSuccess;
      default:
        return 'green';
    }
  }, [type]);

  const topPosition = top + DEFAULT_TOP_SPACING;

  const fadeIn = () => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: animateDuration,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(opacity, {
      toValue: 0,
      duration: animateDuration,
      useNativeDriver: true,
    }).start(() => {
      hideMyself(children);
    });
  };

  useEffect(() => {
    fadeIn();
    const timer = setTimeout(() => {
      fadeOut();
    }, hideAfter);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  /** Will delete after */
  const renderSharingToast = () => {
    return (
      <View style={styles.shareToast}>
        <Text variant="bodyMedium" theme={{colors: {primary: colors.surface}}}>
          {children}
        </Text>
      </View>
    );
  };

  const renderContent = () => {
    switch (type) {
      case ToastType.Sharing:
        return renderSharingToast();
      case ToastType.ErrorV3:
      case ToastType.SuccessV3:
      case ToastType.InfoV3:
      case ToastType.Undo:
        return (
          <ToastV3
            type={type}
            message={children}
            onHide={fadeOut}
            name={name}
            IconLeft={IconLeft}
            onPressRight={onPressRight}
          />
        );
      default:
        return (
          <View style={[{backgroundColor}, styles.content]}>
            <Text
              variant="bodyMedium"
              theme={{colors: {primary: colors.surface}}}>
              {children}
            </Text>
            {IconRight && (
              <>
                <View style={styles.w8} />
                {IconRight}
              </>
            )}
          </View>
        );
    }
  };

  const translateY = opacity.interpolate({
    inputRange: [0, 1],
    outputRange: [-topPosition, topPosition],
  });
  const positionStyle =
    position === 'bottom'
      ? {
          bottom: dynamicBottomPosition || bottom + DEFAULT_BOTTOM_SPACING,
        }
      : {transform: [{translateY}]};

  return (
    <Animated.View
      style={[stylesContainer, styles.toast, positionStyle, {opacity}]}>
      {renderContent()}
    </Animated.View>
  );
};

export default Toast;
