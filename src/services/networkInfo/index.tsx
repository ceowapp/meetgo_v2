import React, { ReactElement } from 'react';
import { StyleSheet } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  Extrapolate,
  Easing,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';

import { resWidth } from 'utils/Screen';
import { useDidUpdate } from 'utils/Utility';
import { useAppDispatch } from 'storeConfig/hook';
import { networkActions } from './slice';
import { COLORS, SPACING } from 'utils/styleGuide';

const DEFAULT_TOP_SPACING = resWidth(16);
const styles = StyleSheet.create({
  container: {
    zIndex: 10,
    position: 'absolute',
    alignSelf: 'center',
    backgroundColor: COLORS.red,
    padding: SPACING.s_8,
    borderRadius: SPACING.s_8,
  },
  content: {
    color: COLORS.primaryWhite,
  },
});

const NetworkInfoHandler = (): ReactElement => {
  const animatedValue = useSharedValue(0);
  const dispatch = useAppDispatch();
  const { top } = useSafeAreaInsets();
  const topPosition = top + DEFAULT_TOP_SPACING;
  const netInfo = useNetInfo();

  const show = () => {
    animatedValue.value = withTiming(1, { duration: 300, easing: Easing.inOut(Easing.ease) });
  };

  const hide = () => {
    animatedValue.value = withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) });
  };

  useDidUpdate(() => {
    dispatch(networkActions.updateStatusNetwork(netInfo.isConnected || false));
    if (netInfo.isConnected) {
      hide();
    } else {
      show();
    }
  }, [netInfo]);

  const animatedStyles = useAnimatedStyle(() => {
    const translateY = interpolate(
      animatedValue.value,
      [0, 1],
      [-topPosition, topPosition],
      Extrapolate.CLAMP
    );
    return {
      opacity: animatedValue.value,
      transform: [{ translateY }],
    };
  });

  return (
    <Animated.View style={[styles.container, animatedStyles]}>
      <Text variant="labelMedium" style={styles.content}>
        Mất kết nối rồi!!
      </Text>
    </Animated.View>
  );
};

export default NetworkInfoHandler;
