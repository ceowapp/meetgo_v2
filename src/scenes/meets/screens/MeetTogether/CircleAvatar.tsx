import React, {FC, useEffect} from 'react';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {resWidth} from 'utils/Screen';
import {COLORS} from 'utils/styleGuide';
import Images from 'utils/Images';
import FastImage from 'react-native-fast-image';

type IPropsAvatar = {
  url?: string;
};
const LinenearAnimated = Animated.createAnimatedComponent(View);

const styles = StyleSheet.create({
  avtContainer: {
    width: resWidth(100),
    aspectRatio: 1,
    borderRadius: 100,
  },
  borderAvt: {
    width: resWidth(100),
    aspectRatio: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.white,
    borderWidth: 2,
    borderRadius: 100,
  },
  avtContain: {
    position: 'absolute',
    left: resWidth(10),
    top: resWidth(10),
    width: resWidth(60),
    aspectRatio: 1,
    borderRadius: 60,
  },
  img: {
    width: resWidth(80),
    height: resWidth(80),
    borderRadius: 100,
  },
});
const CircleAvatar: FC<IPropsAvatar> = ({url}) => {
  const spinShareValue = useSharedValue(0);
  // const lsColors = [
  //   'rgba(255, 0, 0, 1)',
  //   'rgba(255, 154, 0, 1)',
  //   'rgba(208, 222, 33, 1)',
  //   'rgba(79, 220, 74, 1)',
  //   'rgba(63, 218, 216, 1)',
  //   'rgba(47, 201, 226, 1)',
  //   'rgba(28, 127, 238, 1)',
  //   'rgba(95, 21, 242, 1)',
  //   'rgba(186, 12, 248, 1)',
  //   'rgba(251, 7, 217, 1)',
  //   'rgba(255, 0, 0, 1)',
  // ];

  useEffect(() => {
    spinShareValue.value = withRepeat(
      withTiming(360, {
        duration: 30000,
        easing: Easing.linear,
      }),
      Infinity,
      false,
    );
  }, []);
  const spineShareStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${spinShareValue.value}deg`}],
    };
  });
  const avatar = url ? {uri: url} : Images.global.logoPadding;
  const styleAvt = !url
    ? {
        backgroundColor: COLORS.white,
      }
    : undefined;
  return (
    <View>
      <LinenearAnimated style={[styles.avtContainer, spineShareStyle]}>
        <View style={styles.borderAvt} />
      </LinenearAnimated>
      <View style={styles.avtContain}>
        <FastImage
          source={avatar}
          resizeMode="cover"
          style={[styles.img, styleAvt]}
        />
      </View>
    </View>
  );
};
export default CircleAvatar;
