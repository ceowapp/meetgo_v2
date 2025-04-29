import {useIsFocused} from '@react-navigation/native';
import BarcodeMask from 'components/BarcodeMask';
import useToast from 'components/Toast/useToast';
import appConstant from 'constant/appConstant';
import LottieView from 'lottie-react-native';
import {navigateScreen} from 'navigation/RootNavigation';
import {STACK_NAVIGATOR} from 'navigation/types';
import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Linking, StatusBar} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {AuthSelector} from 'scenes/auth/redux/slice';
import {useMeet} from 'scenes/meets/helper/useMeet';
import {useAppSelector} from 'storeConfig/hook';
import Images from 'utils/Images';
import Screen, {perHeight, perWidth, resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import {useEffectAfterTransition} from 'utils/Utility';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {IQrUserInfo} from '../UserScan/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {locationSelector} from 'services/location/slice';
import {ProgressiveImage} from 'components/Image/ProgressiveImage';
import LinearGradient from 'react-native-linear-gradient';
import {ButtonPrimary} from 'components/Button/Primary';
import { useTranslation } from 'react-i18next';

const SCAN_WIDTH = resWidth(200);

const viewFinderBounds = {
  height: SCAN_WIDTH,
  width: SCAN_WIDTH,
  x: (perWidth(100) - SCAN_WIDTH) / 2,
  y: (perHeight(100) - SCAN_WIDTH) / 2,
};

const QrScan = () => {
  const { t } = useTranslation();
  const [hasPermission, setHasPermission] = useState<boolean | 'initial'>(
    'initial',
  );
  const account = useAppSelector(AuthSelector.getAccount);
  const {addToast} = useToast();
  const isFocus = useIsFocused();
  const devices = useCameraDevices();
  const device = devices.back;
  const [frameProcessor, barcodes] = useScanBarcodes([BarcodeFormat.QR_CODE], {
    checkInverted: true,
  });
  const currentLocation = useAppSelector(locationSelector.getCurentLocation);
  const {bottom} = useSafeAreaInsets();

  const {listLocationNearBy, getListLocationMeetNearByMe} = useMeet();
  const dataFakeLocation = useAppSelector(locationSelector.getDataFakeLocation);
  const hasLocationNearBy = listLocationNearBy.length > 0 || !!dataFakeLocation;
  const requestCameraPermission = async () => {
    const resultPermission = await Camera.requestCameraPermission();
    setHasPermission(resultPermission === 'authorized');
  };

  // const onNavigateMeetUser = () => {
  //   const qrInfo = {
  //     idAuth: '105019288835455626238',
  //     email: 'hoangnam1121@gmail.com',
  //     firstname: 'Dao',
  //     lastname: 'Nam',
  //     createdAt: '08-08-2023',
  //     birthday: '17-08-2023',
  //     address: '',
  //     mobilenumber: '0987654321',
  //     gender: 'male',
  //     isFirst: true,
  //     isVerify: false,
  //     photo:
  //       'https://lh3.googleusercontent.com/a/AAcHTtfXpP1oy6m4stQPK2qYrbDJ2ClYdsObaQhmeHWCYy-h1rE=s120',
  //     pincode: '',
  //     balanceCreateLocation: 0,
  //     account: 'MGA-00001079',
  //     appKey: 'com.app.meetgo',
  //   };
  //   navigateScreen(STACK_NAVIGATOR.USER_SCAN, {
  //     qrInfo,
  //   });
  // };

  useEffect(() => {
    if (currentLocation?.latitude && currentLocation.longitude) {
      getListLocationMeetNearByMe(currentLocation);
    }
  }, [currentLocation]);

  useEffect(() => {
    if (barcodes && barcodes[0]?.rawValue) {
      const dataQrCode = JSON.parse(barcodes[0].rawValue) as IQrUserInfo;
      if (dataQrCode.appKey === appConstant.KEY_APP) {
        if (dataQrCode.account === account) {
          addToast({
            message: t('meets.error_self_meet'),
            type: 'ERROR_V3',
            position: 'top',
          });
        } else {
          navigateScreen(STACK_NAVIGATOR.USER_SCAN, {
            qrInfo: dataQrCode,
          });
        }
      } else {
        addToast({
          message: t('meets.error_invalid_qr'),
          type: 'ERROR_V3',
          position: 'top',
        });
      }
    }
  }, [barcodes]);
  useEffectAfterTransition((): ReturnType<any> => {
    requestCameraPermission();
    StatusBar.setBarStyle('light-content');
  }, []);

  const onOpenSettings = () => Linking.openSettings();

  const renderNearLocation = () => {
    const iconNearBy = hasLocationNearBy
      ? 'map-marker-check-outline'
      : 'map-marker-off-outline';
    const colorNearBy = hasLocationNearBy ? COLORS.darkGreen : COLORS.darkRed;
    const contentNearBy = hasLocationNearBy
      ? t('meets.location_nearby_title', {
          location: dataFakeLocation
            ? dataFakeLocation.addressNFT
            : listLocationNearBy[0]?.address || '',
        })
      : t('meets.location_not_nearby');
    return (
      <View style={[styles.locationContainer, {top: bottom}]}>
        <Icon name={iconNearBy} size={SPACING.l_24} color={colorNearBy} />
        <Text variant="labelSmall" style={styles.location} numberOfLines={2}>
          {contentNearBy}
        </Text>
      </View>
    );
  };

  if (!hasPermission) {
    const content = t('meets.permission_alert_message');
    return (
      <LinearGradient
        {...Screen.linearBackground}
        style={styles.containerPermission}>
        <View style={{width: resWidth(164), height: resWidth(246)}}>
          <ProgressiveImage
            source={Images.global.requestCamera}
            resizeMode="contain"
            style={{width: '100%', height: '100%'}}
          />
        </View>
        <Text variant="labelLarge" style={styles.txtPermission}>
          {content}
        </Text>
        <ButtonPrimary
          type="small"
          content={t('meets.permission_alert_now')}
          containerStyle={styles.btnRequest}
          onPress={onOpenSettings}></ButtonPrimary>
      </LinearGradient>
    );
  }

  // if (device == null) {
  //   return <View style={styles.container} />;
  //   return (
  //     <View style={styles.container}>
  //       <Button
  //         mode="elevated"
  //         style={{marginTop: SPACING.s_12}}
  //         onPress={onNavigateMeetUser}>
  //         Fake scan qr
  //       </Button>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      {device && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isFocus}
          orientation="portrait"
          focusable
          frameProcessor={frameProcessor}
          frameProcessorFps={5}
        />
      )}
      {renderNearLocation()}
      <BarcodeMask
        width={viewFinderBounds.width}
        height={viewFinderBounds.height}
        backgroundColor={COLORS.backgroundBlack80}
        edgeColor={COLORS.primary}
        edgeRadius={SPACING.s_12}
        animatedLineColor={COLORS.primary}
        edgeBorderWidth={6}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containerPermission: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: COLORS.onSecondaryContainer,
    top: -90,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: COLORS.backgroundBlack70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtPermission: {
    paddingTop: SPACING.s_8,
    paddingBottom: SPACING.l_32,
    fontFamily: 'Roboto',
    fontSize: resFont(14),
    fontWeight: '400',
    lineHeight: resWidth(16),
    textAlign: 'center',
    color: COLORS.white,
  },
  btnRequest: {
    borderWidth: 1,
    borderColor: COLORS.white,
    width: resWidth(234),
  },
  locationContainer: {
    backgroundColor: COLORS.backgroundWhite10,
    padding: SPACING.m_16,
    margin: SPACING.m_16,
    borderRadius: SPACING.m_16,
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    zIndex: 999,
  },
  location: {
    fontFamily: 'Roboto',
    fontSize: resFont(12),
    fontWeight: '400',
    color: COLORS.white,
    flex: 1,
    marginLeft: SPACING.s_4,
  },
});

export default QrScan;
