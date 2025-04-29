import React, {forwardRef, useImperativeHandle, useMemo} from 'react';
import {ViewStyle, View, Animated} from 'react-native';
/** Components */
/** Contants & Utils */
import {resWidth} from 'utils/Screen';
import styles from './styles';
import {IToastType} from './types';
import colors from 'services/themes/colors';
import {Text} from 'react-native-paper';

interface SpecialToastProps {
  message: string;
  type?: IToastType;
  IconRight?: React.ComponentType<never>;
  animateDuration?: number;
  position: 'top' | 'bottom';
  dynamicBottomPosition?: number;
  hideAfter?: number;
  stylesContainer?: ViewStyle;
}

export enum ToastType {
  Info = 'INFO',
  Error = 'ERROR',
  Success = 'SUCCESS',
  Sharing = 'SHARING',
}

export interface SpecialToastRef {
  runToast: () => void;
}

const DEFAULT_TOP_SPACING = resWidth(14);
const DEFAULT_BOTTOM_SPACING = resWidth(15);

const SpecialToast = forwardRef(
  (
    {
      type = ToastType.Success,
      message,
      IconRight,
      animateDuration = 300,
      hideAfter = 800,
      position,
      stylesContainer,
      dynamicBottomPosition,
    }: SpecialToastProps,
    ref,
  ) => {
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
      }).start();
    };

    const runToast = () => {
      fadeIn();
      setTimeout(() => {
        fadeOut();
      }, hideAfter);
    };

    useImperativeHandle(ref, () => ({
      runToast,
    }));

    /** Will delete after */
    const renderSharingToast = () => {
      return (
        <View style={styles.shareToast}>
          <Text
            variant="bodyMedium"
            theme={{colors: {primary: colors.surface}}}>
            {message}
          </Text>
        </View>
      );
    };

    const renderContent = () => {
      switch (type) {
        case ToastType.Sharing:
          return renderSharingToast();
        default:
          return (
            <View style={[{backgroundColor}, styles.content]}>
              <Text
                variant="bodyMedium"
                theme={{colors: {primary: colors.surface}}}>
                {message}
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
    const positionStyle =
      position === 'bottom'
        ? {
            bottom: dynamicBottomPosition || DEFAULT_BOTTOM_SPACING,
          }
        : {top: DEFAULT_TOP_SPACING};

    return (
      <Animated.View
        style={[
          stylesContainer,
          styles.specialToast,
          positionStyle,
          {opacity},
        ]}>
        {renderContent()}
      </Animated.View>
    );
  },
);
SpecialToast.defaultProps = {
  type: 'SUCCESS',
  IconRight: undefined,
  animateDuration: 300,
  dynamicBottomPosition: 0,
  hideAfter: 800,
  stylesContainer: {},
};
export default SpecialToast;
