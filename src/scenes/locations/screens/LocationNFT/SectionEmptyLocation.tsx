import LottieView from 'lottie-react-native';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import Images from 'utils/Images';
import {perWidth, resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  content: {
    fontFamily: 'Roboto',
    fontSize: resFont(12),
    lineHeight: resWidth(16),
    color: COLORS.white,
    textAlign: 'center',
  },
  img: {
    width: resWidth(280),
    aspectRatio: 1,
  },
});
const SectionEmptyLocation = () => {
  const { t } = useTranslation();
  const content = t('location.empty_title');
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <FastImage
        source={Images.global.emptyNft}
        style={styles.img}
        resizeMode="contain"
      />
      <Text variant="titleMedium" style={styles.content}>
        {content}
      </Text>
    </View>
  );
};
export default SectionEmptyLocation;
