import React, {useEffect} from 'react';
import {RouteProp, useIsFocused, useRoute} from '@react-navigation/native';
import {ButtonPrimary} from 'components/Button/Primary';
import Container from 'components/Container';
import LineBreak from 'components/LineBreak';
import Logo from 'components/Logo';
import {goBack, navigateScreen} from 'navigation/RootNavigation';
import {AppStackParamList, STACK_NAVIGATOR} from 'navigation/types';
import {Image, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {shadow} from 'utils/mixins';
import Screen, {perWidth, resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import {useMeet} from 'scenes/meets/helper/useMeet';
import {useAppSelector} from 'storeConfig/hook';
import {locationSelector} from 'services/location/slice';
import {AccountSelector} from 'scenes/account/redux/slice';
import {showDialogModal} from 'services/globalModal/modalHandler';
import WarningMeetDialog from './WarningMeetDialog';
import Images from 'utils/Images';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerInfo: {flex: 1, alignItems: 'center'},
  location: {
    flex: 1,
    marginLeft: SPACING.s_4,
    fontSize: resFont(12),
    fontFamily: 'Roboto',
    fontWeight: '400',
    lineHeight: resWidth(14),
    color: COLORS.white,
  },
  locationContainer: {
    backgroundColor: COLORS.backgroundWhite10,
    padding: SPACING.m_16,
    marginHorizontal: SPACING.m_16,
    borderRadius: resWidth(10),
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow(),
  },
  bottomContainer: {
    backgroundColor: '#2E2EAA',
    paddingVertical: SPACING.l_24,
    alignItems: 'center',
    width: '100%',
  },
  subBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.m_16,
    width: '100%',
  },
  btnBack: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.transparent,
    marginRight: resWidth(22),
  },
  txtConnect: {
    color: COLORS.primary,
    fontFamily: 'Roboto',
    fontSize: resFont(14),
    fontWeight: '700',
    lineHeight: SPACING.m_16,
  },
  btnConnect: {
    width: 234,
    backgroundColor: COLORS.white,
    ...shadow('low'),
  },
  txtError: {
    color: COLORS.pastelRed,
    paddingTop: SPACING.s_8,
    fontStyle: 'italic',
  },
  rowInfo: {
    width: perWidth(100) - SPACING.m_16 * 2,
    backgroundColor: COLORS.backgroundWhite10,
    borderRadius: resWidth(10),
    padding: SPACING.l_24,
    ...shadow(),
  },
  subRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subLeftInfo: {
    paddingLeft: SPACING.m_16,
    width: '60%',
  },
  txtInfo: {
    color: COLORS.white,
    marginBottom: SPACING.s_12,
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(14),
    lineHeight: SPACING.m_16,
  },
  line: {
    borderStyle: 'solid',
    borderColor: COLORS.white,
  },
  containerAvt: {
    paddingVertical: SPACING.l_24,
    alignItems: 'center',
  },
  avt: {
    color: 'white',
    fontWeight: '700',
    fontSize: resFont(14),
    fontFamily: 'Roboto',
    lineHeight: SPACING.m_16,
    paddingTop: SPACING.m_16,
  },
});
const UserScan = () => {
  const { t } = useTranslation();
  const {params} = useRoute<RouteProp<AppStackParamList, 'USER_SCAN'>>();
  const {qrInfo} = params || {};
  const {
    loading,
    inviteMeetUser,
    connectId,
    getListLocationMeetNearByMe,
    listLocationNearBy,
    dataHistoryOlderMeet,
    checkMeetAgain,
  } = useMeet();
  const currentLocation = useAppSelector(locationSelector.getCurentLocation);
  const numberMeet = useAppSelector(AccountSelector.getNumberOfMeet);
  const dataFakeLocation = useAppSelector(locationSelector.getDataFakeLocation);
  const isFocus = useIsFocused();
  const hasLocationNearBy =
    (listLocationNearBy.length > 0 || dataFakeLocation) && numberMeet > 0;
  useEffect(() => {
    checkMeetAgain(qrInfo.account);
  }, [isFocus]);
  useEffect(() => {
    if (connectId) {
      navigateScreen(STACK_NAVIGATOR.MEET_TOGETHER, {
        connectId,
      });
    }
  }, [connectId]);

  const onInviteMeetUser = () => {
    inviteMeetUser(
      qrInfo.account,
      currentLocation?.latitude || 0,
      currentLocation?.longitude || 0,
      dataFakeLocation,
    );
  };
  const onInviteMeetTogether = () => {
    if (
      (currentLocation?.latitude && currentLocation.longitude) ||
      dataFakeLocation
    ) {
      if (dataHistoryOlderMeet && dataHistoryOlderMeet?.listMeet.length > 0) {
        showDialogModal({
          content: () => (
            <WarningMeetDialog
              data={dataHistoryOlderMeet.listMeet[0]}
              fullName={`${qrInfo.firstname} ${qrInfo.lastname}`}
              onInviteMeetUser={onInviteMeetUser}
              rateBonusAgain={dataHistoryOlderMeet.rateBonusAgain || 0}
            />
          ),
        });
      } else {
        onInviteMeetUser();
      }
    }
  };

  useEffect(() => {
    if (currentLocation?.latitude && currentLocation.longitude) {
      getListLocationMeetNearByMe(currentLocation);
    }
  }, [currentLocation]);

  const renderAvatar = () => {
    const hasName = !qrInfo.firstname || !qrInfo.lastname;
    return (
      <View style={styles.containerAvt}>
        {qrInfo.photo ? (
          <Avatar.Image source={{uri: qrInfo.photo}} size={resWidth(80)} />
        ) : (
          <Logo size={resWidth(96)} />
        )}
        <Text style={styles.avt}>
          {!hasName ? `${qrInfo.firstname} ${qrInfo.lastname}` : 'Meeter'}
        </Text>
      </View>
    );
  };

  const renderRowInfo = (iconName: string, value: string) => {
    let icon;
    if (iconName === 'phone') icon = Images.icon.userScan.iconPhone;
    if (iconName === 'gender') icon = Images.icon.userScan.iconSex;
    return (
      <View style={styles.subRow}>
        <Image source={icon} style={{width: 24}} resizeMode="contain" />
        <View style={styles.subLeftInfo}>
          <Text style={styles.txtInfo}>{value}</Text>
          <LineBreak styleLine={styles.line} />
        </View>
      </View>
    );
  };

  const renderUserInfo = () => {
    return (
      <View style={styles.rowInfo}>
        {renderRowInfo('phone', qrInfo.mobilenumber || t('meets.phone_not_updated'))}
        {/* {renderRowInfo('email', qrInfo.email || 'Chưa cập nhật')} */}
        {/* {renderRowInfo('calendar', qrInfo.birthday || 'Chưa cập nhật')} */}
        {renderRowInfo(
          'gender',
          (qrInfo.gender && qrInfo.gender === 'male' ? 'Nam' : 'Nữ') ||
            t('meets.gender_not_updated'),
        )}
      </View>
    );
  };

  const bottomContainer = () => (
    <View style={styles.bottomContainer}>
      <View style={styles.subBottom}>
        <ButtonPrimary
          content={<Icon size={40} name="chevron-left" color={COLORS.white} />}
          onPress={goBack}
          containerStyle={styles.btnBack}
        />
        <ButtonPrimary
          content={t('meets.button_connect_meet')}
          isLoading={loading}
          disabled={!hasLocationNearBy}
          onPress={onInviteMeetTogether}
          titleStyle={styles.txtConnect}
          containerStyle={[
            styles.btnConnect,
            loading ? {backgroundColor: COLORS.grey3} : undefined,
          ]}
        />
      </View>
      {numberMeet < 1 && (
        <Text style={styles.txtError}>{t('meets.no_meet_left')}</Text>
      )}
    </View>
  );

  const renderNearLocation = () => {
    const iconNearBy = hasLocationNearBy
      ? 'map-marker-check-outline'
      : 'map-marker-off-outline';
    const colorNearBy = hasLocationNearBy ? COLORS.darkGreen : COLORS.darkRed;
    const contentNearBy = hasLocationNearBy
      ? t('meets.nearby_location', {
          location: dataFakeLocation
            ? dataFakeLocation.addressNFT
            : listLocationNearBy[0]?.address || '',
        })
      : t('meets.no_nearby_location');
    return (
      <View style={styles.locationContainer}>
        <Icon name={iconNearBy} size={SPACING.l_24} color={colorNearBy} />
        <Text style={styles.location} numberOfLines={2}>
          {contentNearBy}
        </Text>
      </View>
    );
  };
  return (
    <LinearGradient {...Screen.linearBackground} style={styles.container}>
      <Container edges={['top']}>
        <View style={styles.containerInfo}>
          {renderNearLocation()}
          {renderAvatar()}
          {renderUserInfo()}
        </View>
        {bottomContainer()}
      </Container>
    </LinearGradient>
  );
};
export default UserScan;
