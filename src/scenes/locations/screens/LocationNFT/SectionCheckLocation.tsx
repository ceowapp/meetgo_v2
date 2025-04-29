import {ButtonPrimary} from 'components/Button/Primary';
import LottieView from 'lottie-react-native';
import {Permission} from 'manager/appPermission';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Button, Text} from 'react-native-paper';
import {PermissionStatus, RESULTS} from 'react-native-permissions';
import {locationActions} from 'services/location/slice';
import {useAppDispatch} from 'storeConfig/hook';
import Images from 'utils/Images';
import {perWidth, resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import { useTranslation } from 'react-i18next';

type IProps = {
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
const SectionCheckLocation: FC<IProps> = ({setResultPermission}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const onRequestPermission = async () => {
    const result = await Permission.requestPermission('location');
    if (result === RESULTS.GRANTED) {
      dispatch(locationActions.updatePermissionLocation(result));
    }
    setResultPermission(result);
  };
  const content = t('location.check_title');
  return (
    <View style={styles.container}>
      <FastImage
        source={Images.global.requestLocation2}
        resizeMode="contain"
        style={{width: resWidth(258), aspectRatio: 1}}
      />
      <Text style={styles.txt}>{content}</Text>
      <ButtonPrimary
        type="small"
        content={t('location.check_grant_now')}
        containerStyle={styles.btn}
        onPress={onRequestPermission}
      />
    </View>
  );
};
export default SectionCheckLocation;
