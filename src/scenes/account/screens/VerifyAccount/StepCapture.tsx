import {useIsFocused} from '@react-navigation/native';
import Container from 'components/Container';
import LottieView from 'lottie-react-native';
import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import {ActivityIndicator, Text, Button} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {IDataImage} from 'scenes/account/redux/types';
import Images from 'utils/Images';
import Platform from 'utils/Platform';
import Screen, {perHeight, perWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import {sleep, useEffectAfterTransition} from 'utils/Utility';
import { useTranslation } from 'react-i18next';

type IProps = {
  pos: number;
  onCapture: (dataImg: IDataImage) => void;
  isFront?: boolean;
  isActive: boolean;
  isPermission: boolean;
  requestPermission: () => void;
};
const fakeImg =
  'https://images.unsplash.com/photo-1575936123452-b67c3203c357?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D&w=1000&q=80';
const fakeImg2 =
  'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg';
const fakeImg3 =
  'https://upload.wikimedia.org/wikipedia/commons/b/b6/Image_created_with_a_mobile_phone.png';
const StepCapture: FC<IProps> = ({
  pos,
  isFront = true,
  isActive,
  isPermission,
  onCapture,
  requestPermission,
}) => {
  const { t } = useTranslation();
  const {bottom} = useSafeAreaInsets();
  const devices = useCameraDevices();
  const device = isFront ? devices.back : devices.front;
  const isFocus = useIsFocused();
  const cameraRef = useRef<Camera>(null);
  const [isCapture, setCapture] = useState<boolean>(false);

  const onOpenSettings = async () => {
    requestPermission();
    // Linking.openSettings();
  };
  const takePicture = async () => {
    if (!isCapture) {
      setCapture(true);
      // await sleep(1000);
      // if (pos === 1) {
      //   const dataImg: IDataImage = {
      //     uri: fakeImg,
      //     fileName: 'name',
      //     type: 'image/jpg',
      //   };
      //   onCapture(dataImg);
      // }
      // if (pos === 3) {
      //   const dataImg: IDataImage = {
      //     uri: fakeImg2,
      //     fileName: 'name',
      //     type: 'image/jpg',
      //   };
      //   onCapture(dataImg);
      // }
      // if (pos === 5) {
      //   const dataImg: IDataImage = {
      //     uri: fakeImg3,
      //     fileName: 'name',
      //     type: 'image/jpg',
      //   };
      //   onCapture(dataImg);
      // }

      const photo = await cameraRef.current?.takePhoto({
        qualityPrioritization: 'speed',
      });
      if (photo && photo.path) {
        let namePhoto = 'idFront';
        if (pos === 3) {
          namePhoto = 'idBack';
        } else if (pos === 5) {
          namePhoto = 'selfie';
        }
        const dataImg: IDataImage = {
          uri: Platform.isIos ? photo.path : `file://${photo.path}`,
          fileName: namePhoto,
          type: 'image/jpg',
        };
        onCapture(dataImg);
      }
      setCapture(false);
    }
  };

  const renderPermissionCamera = () => (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        backgroundColor: COLORS.onSecondaryContainer,
        padding: SPACING.l_24,
      }}>
      <LottieView
        loop
        autoPlay
        source={Images.animation.qrscan}
        style={{
          width: perWidth(50),
          aspectRatio: 1,
        }}
      />
      <Text variant="labelLarge" style={{color: 'white', textAlign: 'center'}}>
        {t('account.camera_permission_message')}
      </Text>
      <Button
        mode="elevated"
        style={{marginTop: SPACING.s_12}}
        onPress={onOpenSettings}>
        {t('account.grant_permission_now')}
      </Button>
    </View>
  );

  const renderCamera = useMemo(() => {
    if (isFocus && isActive && !!device && isPermission) {
      return (
        <Camera
          ref={cameraRef}
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          orientation="portrait"
          focusable
          photo
        />
      );
    } else if (!isPermission) {
      return renderPermissionCamera();
    }
    return <></>;
  }, [isFocus, device, isActive]);

  const contentCapture = useCallback(() => {
    if (pos < 2) {
      return t('account.capture_front_id');
    }
    if (pos < 4) {
      return t('account.capture_back_id');
    }
    if (pos < 6) {
      return t('account.capture_selfie_with_id');
    }
  }, [pos, t]);

  return (
    <View
      style={{
        justifyContent: 'space-between',
        paddingBottom: bottom > 0 ? 0 : SPACING.l_24,
      }}>
      <View
        style={{
          borderRadius: SPACING.m_16,
          width: '100%',
          overflow: 'hidden',
          height: perHeight(58) - Screen.getSoftMenuBarHeight(),
        }}>
        {renderCamera}
        {isCapture && (
          <ActivityIndicator color="white" style={StyleSheet.absoluteFill} />
        )}
      </View>
      <View style={{alignItems: 'center'}}>
        <Text
          style={{
            color: COLORS.tertiaryContainer,
            textAlign: 'center',
            paddingVertical: SPACING.m_16,
            fontStyle: 'italic',
          }}>
          {contentCapture()}
        </Text>

        <TouchableOpacity
          disabled={isCapture}
          onPress={takePicture}
          style={{
            borderRadius: 58,
            borderWidth: 1,
            borderColor: 'white',
            width: 58,
            height: 58,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 44,
              width: 44,
              height: 44,
            }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default StepCapture;
