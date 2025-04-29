import LottieView from 'lottie-react-native';
import {Permission} from 'manager/appPermission';
import React, {FC} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import {PermissionStatus, RESULTS} from 'react-native-permissions';
import Images from 'utils/Images';
import Platform from 'utils/Platform';
import {perWidth, resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import {Permission as PermissionApp} from 'manager/appPermission';
import FastImage from 'react-native-fast-image';
import {ButtonPrimary} from 'components/Button/Primary';
import { useTranslation } from 'react-i18next';

type IProps = {
  resultPermission: PermissionStatus;
  setResultPermission: (result: PermissionStatus) => void;
};
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    top: -resWidth(85),
    alignItems: 'center',
  },
  txt: {
    fontFamily: 'Roboto',
    fontSize: resFont(12),
    fontWeight: '400',
    lineHeight: resWidth(14),
    textAlign: 'center',
    color: COLORS.white,
  },
  btn: {
    marginTop: resWidth(34),
    width: resWidth(234),
    height: resWidth(54),
    borderWidth: 1,
    borderColor: COLORS.white,
  },
});
const SectionBlockedLocation: FC<IProps> = ({
  resultPermission,
  setResultPermission,
}) => {
  const { t } = useTranslation();
  const onOpenSettings = async () => {
    if (Platform.isIos) {
      if (resultPermission === RESULTS.UNAVAILABLE) {
        const linkingPermission = 'App-prefs:Privacy&path=LOCATION';
        const canOpenPermission = await Linking.canOpenURL(linkingPermission);
        if (canOpenPermission) {
          Linking.openURL(linkingPermission);
        }
      } else {
        Linking.openSettings();
      }
    } else {
      const result = await PermissionApp.checkPermission('location');
      if (result !== RESULTS.GRANTED) {
        await Linking.openSettings();
      } else {
        setResultPermission(result);
      }
    }
  };
  const content = t('location.blocked_title');
  return (
    <View style={styles.container}>
      <FastImage
        source={Images.global.requestLocation}
        resizeMode="contain"
        style={{width: resWidth(218), aspectRatio: 1}}
      />
      <Text style={styles.txt}>{content}</Text>
      <ButtonPrimary
        type="small"
        content={t('location.grant_now')}
        containerStyle={styles.btn}
        onPress={onOpenSettings}
      />
    </View>
  );
};
export default SectionBlockedLocation;
