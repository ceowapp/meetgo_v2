import Container from 'components/Container';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import {useAppSelector} from 'storeConfig/hook';
import {COLORS, SPACING} from 'utils/styleGuide';
import Screen, {perWidth, resFont, resWidth} from 'utils/Screen';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {goBack} from 'navigation/RootNavigation';
import {AccountSelector} from 'scenes/account/redux/slice';
import Images from 'utils/Images';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import appConstant from 'constant/appConstant';
import {IQrUserInfo} from 'scenes/meets/screens/UserScan/types';
import {AuthSelector} from 'scenes/auth/redux/slice';
import {shadow} from 'utils/mixins';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  title: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(14),
    lineHeight: resWidth(16),
    color: COLORS.white,
    backgroundColor: 'transparent',
  },
  header: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: resWidth(18),
  },
  container: {
    width: perWidth(100) - SPACING.l_24 * 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: resWidth(10),
    ...shadow('low'),
  },
  shadow: {
    ...shadow(),
  },
});
const MyQr = () => {
  const { t } = useTranslation();
  const userInfo = useAppSelector(AccountSelector.getUserInfo);
  const account = useAppSelector(AuthSelector.getAccount);
  const dataQr: IQrUserInfo = userInfo
    ? {
        firstname: userInfo.firstname,
        lastname: userInfo.lastname,
        // birthday: userInfo.birthday,
        // email: userInfo.email,
        photo: userInfo.photo,
        // mobilenumber: userInfo.mobilenumber,
        // gender: userInfo.gender,
        account,
        appKey: appConstant.KEY_APP,
      }
    : ({appKey: appConstant.KEY_APP} as IQrUserInfo);
  const compressInfo = JSON.stringify(dataQr);
  const logoQr =
    userInfo?.photo && userInfo.photo !== ''
      ? userInfo.photo
      : Images.global.logoPadding;
  return (
    <LinearGradient
      {...Screen.linearBackground}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={styles.container}>
        <View style={{padding: SPACING.l_24, alignItems: 'center'}}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('home.my_qr_code')}</Text>
            <Icon
              name="close"
              size={SPACING.m_16}
              color={COLORS.white}
              onPress={goBack}
            />
          </View>

          <QRCode
            value={compressInfo}
            size={perWidth(50)}
            logo={logoQr}
            logoSize={SPACING.l_48}
            logoBorderRadius={SPACING.l_32}
            logoBackgroundColor={COLORS.white}
          />
          <Text
            variant="titleMedium"
            style={{
              color: COLORS.white,
              paddingTop: SPACING.l_24,
              textAlign: 'center',
            }}>
            {t('home.scan_qr_to_meet')}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};
export default MyQr;
