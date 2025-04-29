import {ButtonPrimary} from 'components/Button/Primary';
import Container from 'components/Container';
import {backToTopScreen} from 'navigation/RootNavigation';
import React, {FC} from 'react';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useAccountKyc from 'scenes/account/helper/useAccountKyc';
import {IDataImage} from 'scenes/account/redux/types';
import Platform from 'utils/Platform';
import Screen, {perHeight} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import { useTranslation } from 'react-i18next';

type IPropsPreview = {
  dataImg: IDataImage | undefined;
  currentPosition: number;
  onNextPage: () => void;
  onPrevPage: () => void;
};

const StepPreview: FC<IPropsPreview> = ({
  dataImg,
  onNextPage,
  currentPosition,
  onPrevPage,
}) => {
  const { t } = useTranslation();
  const {
    loading,
    uploadImgFrontId,
    uploadImgBackId,
    uploadImgKycWithId,
    approveKyc,
  } = useAccountKyc();
  const {bottom} = useSafeAreaInsets();
  const callbackApprove = (status: {status: boolean}) => {
    if (status) {
      backToTopScreen();
    }
  };

  const callback = (status: {status: boolean}) => {
    if (status) {
      if (currentPosition === 2 || currentPosition === 4) {
        onNextPage();
      }
      if (currentPosition === 6) {
        approveKyc(callbackApprove);
      }
    }
  };
  const onConfirm = () => {
    if (dataImg) {
      const data = {
        ...dataImg,
        uri: Platform.isIos ? dataImg.uri.replace('file://', '') : dataImg.uri,
      };
      if (currentPosition === 2) {
        uploadImgFrontId(data, callback);
      } else if (currentPosition === 4) {
        uploadImgBackId(data, callback);
      } else if (currentPosition === 6) {
        uploadImgKycWithId(data, callback);
      }
    }
  };
  return (
    <Container
      edges={['bottom']}
      style={{
        justifyContent: 'space-between',
        backgroundColor: 'transparent',
        paddingBottom: bottom > 0 ? 0 : SPACING.l_24,
      }}>
      <View
        style={{
          borderRadius: SPACING.m_16,
          width: '100%',
          overflow: 'hidden',
          height: perHeight(60) - Screen.getSoftMenuBarHeight(),
          transform: [{scaleX: currentPosition !== 6 ? 1 : -1}],
        }}>
        <FastImage
          resizeMode="cover"
          source={{uri: dataImg?.uri}}
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </View>
      <View style={{flexDirection: 'row'}}>
        <ButtonPrimary
          content={t('account.recapture')}
          onPress={onPrevPage}
          disabled={loading}
          isLoading={loading}
          containerStyle={{
            flex: 1,
            backgroundColor: COLORS.primaryPink,
          }}
        />
        <View style={{width: SPACING.l_24}} />
        <ButtonPrimary
          content={t('account.confirm')}
          onPress={onConfirm}
          disabled={loading}
          isLoading={loading}
          containerStyle={{
            flex: 1,
          }}
        />
      </View>
    </Container>
  );
};
export default StepPreview;
