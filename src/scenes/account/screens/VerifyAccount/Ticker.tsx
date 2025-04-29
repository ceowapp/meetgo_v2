import React from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {perHeight, perWidth, resFont} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import { useTranslation } from 'react-i18next';

const TICKER_HEIGHT = resFont(24);
const styles = StyleSheet.create({
  tickerContainer: {
    marginVertical: SPACING.s_12,
    marginHorizontal: SPACING.l_24,
    overflow: 'hidden',
    height: TICKER_HEIGHT,
  },
  tickerText: {
    fontSize: resFont(20),
    lineHeight: TICKER_HEIGHT,
    textTransform: 'uppercase',
    fontWeight: '800',
    color: COLORS.white,
  },
});
const Ticker = ({
  scrollOffsetAnimatedValue,
  positionAnimatedValue,
}: {
  scrollOffsetAnimatedValue: Animated.Value;
  positionAnimatedValue: Animated.Value;
}) => {
  const { t } = useTranslation();
  const labels = [
    t('account.IDInfo'),
    t('account.captureFront'),
    t('account.reviewFront'),
    t('account.captureBack'),
    t('account.reviewBack'),
    t('account.selfieWithID'),
    t('account.confirmID'),
  ];
  const inputRange = [0, labels.length];
  const translateY = Animated.add(
    scrollOffsetAnimatedValue,
    positionAnimatedValue,
  ).interpolate({
    inputRange,
    outputRange: [0, labels.length * -TICKER_HEIGHT],
  });
  return (
    <View style={styles.tickerContainer}>
      <Animated.View style={{transform: [{translateY}]}}>
        {labels.map((type, index) => {
          return (
            <Text key={index} style={styles.tickerText}>
              {type}
            </Text>
          );
        })}
      </Animated.View>
    </View>
  );
};
export default Ticker;
