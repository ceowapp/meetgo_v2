import React, {memo, FC} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import Animated, {useAnimatedStyle, interpolate, Extrapolate} from 'react-native-reanimated';
import {resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';

interface Props {
  total: number;
  index: Animated.SharedValue<number>; // 🟢 Now expects a shared value!
  color?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

const DOT_SIZE = resWidth(10);
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dot: {
    marginHorizontal: SPACING.s_6,
    borderRadius: 9999,
    height: DOT_SIZE,
    width: DOT_SIZE,
    backgroundColor: COLORS.white,
  },
});

const CarouselDot: FC<Props> = ({
  total,
  index,
  color = COLORS.white,
  containerStyle,
}) => {
  const dots = [];
  for (let i = 0; i < total; i++) {
    const animatedStyle = useAnimatedStyle(() => {
      const inputRange = [i - 1, i, i + 1];
      const scale = interpolate(index.value, inputRange, [1, 1.25, 1], Extrapolate.CLAMP);
      const opacity = interpolate(index.value, inputRange, [0.4, 1, 0.4], Extrapolate.CLAMP);

      return {
        transform: [{ scale }],
        opacity,
      };
    }, [index]);

    dots.push(
      <Animated.View
        key={i}
        style={[
          styles.dot,
          { backgroundColor: color },
          animatedStyle,
        ]}
      />
    );
  }

  return <View style={[styles.container, containerStyle]}>{dots}</View>;
};

export default memo(CarouselDot);
