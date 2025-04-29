import {RouteProp, useRoute} from '@react-navigation/native';
import CommonHeader from 'components/CommonHeader';
import Container from 'components/Container';
import {AppStackParamList} from 'navigation/types';
import React, {useRef, useState} from 'react';
import {StyleSheet, Animated, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import PagerView, {
  PagerViewOnPageScrollEventData,
} from 'react-native-pager-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import StepIndicator from 'react-native-step-indicator';
import {Camera} from 'react-native-vision-camera';
import {IDataImage} from 'scenes/account/redux/types';
import Screen, {resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import {useEffectAfterTransition} from 'utils/Utility';
import StepCapture from './StepCapture';
import StepPreview from './StepPreview';
import Ticker from './Ticker';
import UpdateInfoKYC from './UpdateInfoKYC';
import { useTranslation } from 'react-i18next';

const AnimatedPager = Animated.createAnimatedComponent(PagerView);

const customStyles = {
  // stepIndicatorSize: 25,
  currentStepIndicatorSize: 35,
  separatorStrokeWidth: 4,
  currentStepStrokeWidth: 3,
  stepStrokeCurrentColor: COLORS.white,
  stepStrokeWidth: 3,
  stepStrokeFinishedColor: COLORS.primary,
  stepStrokeUnFinishedColor: '#aaaaaa',
  separatorFinishedColor: COLORS.primary,
  separatorUnFinishedColor: '#aaaaaa',
  stepIndicatorFinishedColor: COLORS.primary,
  stepIndicatorUnFinishedColor: '#ffffff',
  stepIndicatorCurrentColor: COLORS.primary,
  stepIndicatorLabelFontSize: 13,
  currentStepIndicatorLabelFontSize: 13,
  stepIndicatorLabelCurrentColor: COLORS.white,
  stepIndicatorLabelFinishedColor: '#ffffff',
  stepIndicatorLabelUnFinishedColor: '#aaaaaa',
  labelColor: '#999999',
  labelSize: 13,
  //   currentStepLabelColor: '#fe7013',
};

const VerifyAccount = () => {
  const { t } = useTranslation();
  const {params} = useRoute<RouteProp<AppStackParamList, 'VERIFY_ACCOUNT'>>();
  const {infoKyc} = params || {};
  const [currentPosition, setPosition] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const {top} = useSafeAreaInsets();
  const scrollOffsetAnimatedValue = useRef(new Animated.Value(0)).current;
  const positionAnimatedValue = useRef(new Animated.Value(0)).current;
  const [frontImgIdentity, setFrontImgIdentity] = useState<IDataImage>();
  const [backImgIdentity, setBackImgIdentity] = useState<IDataImage>();
  const [avtIdentity, setAvtIdentity] = useState<IDataImage>();
  const [permissionCamera, setPermissionCamera] = useState(false);
  const onCapture = (dataImg: IDataImage) => {
    if (currentPosition === 1) {
      setFrontImgIdentity(dataImg);
    } else if (currentPosition === 3) {
      setBackImgIdentity(dataImg);
    } else if (currentPosition === 5) {
      setAvtIdentity(dataImg);
    }
    onNextPage();
  };

  const requestCameraPermission = async () => {
    const resultPermission = await Camera.requestCameraPermission();
    setPermissionCamera(resultPermission === 'authorized');
  };
  useEffectAfterTransition((): ReturnType<any> => {
    requestCameraPermission();
  }, []);

  const onNextPage = () => {
    setPosition(currentPosition + 1);
    pagerRef.current?.setPage(currentPosition + 1);
    if (
      currentPosition === 0 ||
      currentPosition === 2 ||
      currentPosition === 4 ||
      currentPosition === 6
    ) {
      setCurrentStep(currentStep + 1);
    }
  };
  const onPreviousPage = () => {
    setPosition(currentPosition - 1);
    pagerRef.current?.setPage(currentPosition - 1);
  };
  return (
    <LinearGradient {...Screen.linearBackground} style={{flex: 1}}>
      <Container edges={['bottom']}>
        <CommonHeader
          title={t('account.verifyAccount')}
          containerStyle={[
            styles.header,
            {
              height: top + resWidth(44),
            },
          ]}
        />
        <View style={{paddingTop: SPACING.m_16}} />
        <StepIndicator
          stepCount={4}
          customStyles={customStyles}
          currentPosition={currentStep}
          // labels={labels}
        />
        <Ticker
          scrollOffsetAnimatedValue={scrollOffsetAnimatedValue}
          positionAnimatedValue={positionAnimatedValue}
        />
        <AnimatedPager
          ref={pagerRef}
          style={styles.pagerView}
          scrollEnabled={false}
          initialPage={currentPosition}
          onPageScroll={Animated.event<PagerViewOnPageScrollEventData>(
            [
              {
                nativeEvent: {
                  offset: scrollOffsetAnimatedValue,
                  position: positionAnimatedValue,
                },
              },
            ],
            {
              useNativeDriver: true,
            },
          )}>
          <UpdateInfoKYC onNextPage={onNextPage} infoKyc={infoKyc} />
          <StepCapture
            pos={currentPosition}
            onCapture={onCapture}
            isActive={currentPosition === 1}
            isPermission={permissionCamera}
            requestPermission={requestCameraPermission}
          />
          <StepPreview
            dataImg={frontImgIdentity}
            onNextPage={onNextPage}
            onPrevPage={onPreviousPage}
            currentPosition={currentPosition}
          />
          <StepCapture
            pos={currentPosition}
            onCapture={onCapture}
            isActive={currentPosition === 3}
            isPermission={permissionCamera}
            requestPermission={requestCameraPermission}
          />
          <StepPreview
            dataImg={backImgIdentity}
            onNextPage={onNextPage}
            onPrevPage={onPreviousPage}
            currentPosition={currentPosition}
          />
          <StepCapture
            isFront={false}
            pos={currentPosition}
            onCapture={onCapture}
            isActive={currentPosition === 5}
            isPermission={permissionCamera}
            requestPermission={requestCameraPermission}
          />
          <StepPreview
            dataImg={avtIdentity}
            onNextPage={onNextPage}
            onPrevPage={onPreviousPage}
            currentPosition={currentPosition}
          />
        </AnimatedPager>
      </Container>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    marginHorizontal: SPACING.l_24,
  },
  header: {
    alignItems: 'flex-end',
    paddingBottom: SPACING.m_16,
  },
});

export default VerifyAccount;
