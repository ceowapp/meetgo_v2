import React, {ComponentClass, useCallback, useState, FC} from 'react';
import {Image, StyleSheet, View, ViewStyle} from 'react-native';
import FastImage, {FastImageProps} from 'react-native-fast-image';
import Animated, {EasingNode, useValue} from 'react-native-reanimated';
import ContentLoader from 'react-content-loader/native';
import {Rect} from 'react-native-svg';
import Images from 'utils/Images';
import {COLORS} from 'utils/styleGuide';

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorImage: {
    width: '100%',
    height: '100%',
  },
});

type IAnimateImageProps = {
  type?: 'square' | 'circle';
};
const AnimatedImage = Animated.createAnimatedComponent(
  FastImage as ComponentClass<FastImageProps, unknown>,
);
export const ProgressiveImage: FC<FastImageProps & IAnimateImageProps> =
  props => {
    const [loadEnd, setLoadEnd] = useState<boolean>(false);
    const [loadFailed, setLoadFailed] = useState<boolean>(false);
    const imageOpacity = useValue(0);
    const onLoad = () => {
      Animated.timing(imageOpacity, {
        toValue: 1,
        easing: EasingNode.linear,
        duration: 500,
      }).start(() => {
        setLoadEnd(true);
      });
    };

    const onError = () => setLoadFailed(true);
    const {style, type = 'square', source} = props;
    const containerStyle: ViewStyle = StyleSheet.flatten([
      style,
      {
        overflow: 'hidden',
      },
    ]);

    const errorStyle: ViewStyle = StyleSheet.flatten([
      styles.errorContainer,
      {
        backgroundColor: type === 'circle' ? COLORS.transparent : COLORS.grey5,
        overflow: 'hidden',
      },
    ]);

    const imageFallback =
      type === 'square' ? Images.global.emptyImg : Images.global.logo;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (source?.uri?.length === 0)
      return (
        <View style={containerStyle}>
          <View style={errorStyle}>
            <Image
              source={imageFallback}
              resizeMode="cover"
              style={styles.errorImage}
            />
          </View>
        </View>
      );

    const renderImage = useCallback(
      () => (
        <AnimatedImage
          {...props}
          onLoad={onLoad}
          onError={onError}
          style={[StyleSheet.absoluteFill, {opacity: imageOpacity}]}
        />
      ),
      [],
    );

    return (
      <View style={containerStyle}>
        {!loadEnd && !loadFailed ? (
          <ContentLoader backgroundColor={COLORS.grey3}>
            <Rect
              x="0"
              y="0"
              width="100%"
              height="100%"
              rx={type === 'circle' ? 9999 : 0}
              ry={type === 'circle' ? 9999 : 0}
            />
          </ContentLoader>
        ) : null}
        {loadFailed ? (
          <View style={errorStyle}>
            <Image
              source={imageFallback}
              resizeMode="cover"
              style={styles.errorImage}
            />
          </View>
        ) : null}
        {renderImage()}
      </View>
    );
  };
