import {useNavigation} from '@react-navigation/native';
import {STACK_NAVIGATOR} from 'navigation/types';
import React, {useState} from 'react';
import {Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AccountSelector} from 'scenes/account/redux/slice';
import {useAppSelector} from 'storeConfig/hook';
import Images from 'utils/Images';
import {shadow} from 'utils/mixins';
import {perWidth, resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  container: {
    borderRadius: SPACING.s_12,
    paddingHorizontal: SPACING.m_16,
    paddingBottom: SPACING.s_8,
    paddingTop: SPACING.s_12,
    height: resWidth(138),
    width: perWidth(100) - SPACING.m_16 * 2,
    alignSelf: 'center',
    backgroundColor: COLORS.backgroundWhite10,
    shadowOpacity: 0.5,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowColor: COLORS.primaryBlack,
    shadowRadius: 10,
    marginTop: resWidth(20),
  },
  rowPanel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: resWidth(14),
  },
  rowPoint: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: SPACING.s_6,
  },
  rowNormal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txt: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(12),
    lineHeight: resWidth(14),
    textAlign: 'center',
    paddingTop: SPACING.s_6,
    color: COLORS.white,
  },
  txtGrey: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(12),
    lineHeight: resWidth(14),
    textAlign: 'center',
    color: COLORS.white,
  },
  pl4: {
    paddingLeft: SPACING.s_4,
  },
  dash: {
    height: 1,
    borderWidth: 1,
    borderColor: COLORS.white,
    borderStyle: 'dashed',
  },
  overflow: {
    height: 1,
    overflow: 'hidden',
  },
  flex1: {
    flex: 1,
    alignItems: 'center',
  },
  point: {
    top: -resWidth(3),
    marginLeft: SPACING.s_4,
    aspectRatio: 1,
    width: SPACING.m_16,
  },
  img: {
    width: resWidth(40),
    height: resWidth(40),
  },
});
const MainPanel = () => {
  const { t } = useTranslation();
  const [showPoint, setShowPoint] = useState(false);
  const {navigate} = useNavigation();
  const meetPoint = useAppSelector(AccountSelector.getMeetpoint);
  const myQr = t('home.my_qr');
  const connectMeet = t('home.connect_meet');
  const inviteFriend = t('home.invite_friend');
  const historyMeetPoint = t('home.history_meet_point');
  const point = showPoint ? meetPoint : '******';
  const iconEye = showPoint ? 'eye-outline' : 'eye-off-outline';

  const navigateMyQr = () => {
    // @ts-ignore
    navigate(STACK_NAVIGATOR.MY_QR);
  };

  const navigateMeetConnect = () => {
    // @ts-ignore
    navigate(STACK_NAVIGATOR.BOTTOM_TAB.MEET_SCAN);
  };

  const navigateHistorymeet = () => {
    // @ts-ignore
    navigate(STACK_NAVIGATOR.HISTORY_POINT);
  };

  const navigateFutureScreen = () => {
    // @ts-ignore
    navigate('futureScreen');
  };
  return (
    <View style={styles.container}>
      <View style={styles.rowPanel}>
        <TouchableOpacity onPress={navigateMyQr} style={styles.flex1}>
          <Image source={Images.icon.home.qr} style={styles.img} />
          <Text style={styles.txt}>{myQr}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateMeetConnect} style={styles.flex1}>
          <Image source={Images.icon.home.connect} style={styles.img} />
          <Text style={styles.txt}>{connectMeet}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={navigateHistorymeet} style={styles.flex1}>
          <Image source={Images.icon.home.history} style={styles.img} />
          <Text style={styles.txt}>{historyMeetPoint}</Text>
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={navigateFutureScreen} style={styles.flex1}>
          <Image source={Images.icon.home.invite} />
          <Text style={styles.txt}>{inviteFriend}</Text>
        </TouchableOpacity> */}
      </View>
      <View style={styles.overflow}>
        <View style={styles.dash}></View>
      </View>
      <View style={styles.rowPoint}>
        <TouchableOpacity
          onPress={() => setShowPoint(val => !val)}
          style={styles.rowNormal}>
          <Icon name={iconEye} size={SPACING.l_24} color={COLORS.white} />
          <Text style={[styles.txtGrey, styles.pl4]}>{point}</Text>
          {showPoint && (
            <Image
              source={Images.global.logo}
              style={styles.point}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
        <View style={styles.rowNormal}>
          <Text variant="labelSmall" style={styles.txtGrey}>
            {t('home.link_now')}
          </Text>
          <Icon name="key" size={SPACING.l_24} color={COLORS.grey3} />
        </View>
      </View>
    </View>
  );
};
export default MainPanel;
