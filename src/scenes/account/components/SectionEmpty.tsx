import LottieView from 'lottie-react-native';
import React, {FC} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import Images from 'utils/Images';
import {perWidth} from 'utils/Screen';
import {SPACING} from 'utils/styleGuide';
import { useTranslation } from 'react-i18next';

type IProps = {
  message?: string;
};
const SectionEmpty: FC<IProps> = ({message}) => {
  const { t } = useTranslation();
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <LottieView
        loop
        autoPlay
        source={Images.animation.emptyLocation}
        style={{
          width: perWidth(60),
          aspectRatio: 1,
          marginBottom: SPACING.l_32,
        }}
      />
      <Text variant="titleMedium" style={{textAlign: 'center'}}>
        {message || t('account.emptyReferralMessage')}
      </Text>
    </View>
  );
};
export default SectionEmpty;
