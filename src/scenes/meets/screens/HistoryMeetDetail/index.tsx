import {RouteProp, useRoute} from '@react-navigation/native';
import CommonHeader from 'components/CommonHeader';
import LineBreak from 'components/LineBreak';
import Logo from 'components/Logo';
import {IStatusMeet} from 'constant/commonType';
import moment from 'moment';
import {AppStackParamList} from 'navigation/types';
import React, {useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Avatar, Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {AuthSelector} from 'scenes/auth/redux/slice';
import {useAppSelector} from 'storeConfig/hook';
import {shadow} from 'utils/mixins';
import Screen, {resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    paddingBottom: SPACING.m_16,
  },
  container: {
    backgroundColor: COLORS.backgroundWhite10,
    padding: SPACING.m_16,
    marginHorizontal: SPACING.m_16,
    marginTop: SPACING.l_24,
    borderRadius: resWidth(10),
    ...shadow(),
  },
  txtName: {
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: resFont(16),
    color: COLORS.white,
    lineHeight: resWidth(18),
    paddingLeft: SPACING.m_16,
  },
  fristCol: {
    width: resWidth(90),
    alignItems: 'center',
    color: COLORS.white,
    fontWeight: '400',
    fontFamily: 'Roboto',
    fontSize: resFont(12),
    lineHeight: resWidth(14),
  },
  secondCol: {
    color: COLORS.white,
    fontWeight: '700',
    fontFamily: 'Roboto',
    fontSize: resFont(12),
    lineHeight: resWidth(14),
  },
});
const HistoryMeetDetail = () => {
  const { t } = useTranslation();
  const {params} =
    useRoute<RouteProp<AppStackParamList, 'HISTORY_MEET_DETAIL'>>();
  const account = useAppSelector(AuthSelector.getAccount);
  const {top} = useSafeAreaInsets();
  const {item} = params;
  const isCaller = item.accountInvite === account;
  const nameMeeter = isCaller
    ? `${item.firstnameAccountInvited} ${item.lastnameAccountInvited}`
    : `${item.firstnameAccountInvite} ${item.lastnameAccountInvite}`;
  const avatar = isCaller ? item.imageAccountInvited : item.imageAccountInvite;
  const bonusMeetPoint = isCaller
    ? item.meetpointForInvite
    : item.meetpointForInvited;
  const dataStatus = useMemo(() => {
    let color = COLORS.primaryYellow;
    let content = t('meets.status_waiting');
    switch (item.statusMeet) {
      case IStatusMeet.DONE:
      case IStatusMeet.PENDING_SUCCESS: {
        color = COLORS.pasteGreen;
        content = t('meets.status_meet_success');
        break;
      }
      case IStatusMeet.INVITED_REJECT: {
        if (isCaller) {
          content = t('meets.status_invited_reject');
        } else {
          content = t('meets.status_you_reject');
        }
        color = COLORS.pastelRed;
        break;
      }
      case IStatusMeet.INVITE_REJECT: {
        if (isCaller) {
          content = t('meets.status_you_reject');
        } else {
          content = t('meets.status_invited_reject');
        }
        color = COLORS.pastelRed;
        break;
      }
      case IStatusMeet.INVITED_FAIL: {
        if (isCaller) {
          content = t('meets.status_you_early_end');
        } else {
          content = t('meets.status_invited_early_end');
        }
        color = COLORS.pastelRed;
        break;
      }
      case IStatusMeet.INVITE_FAIL: {
        color = COLORS.pastelRed;
        if (isCaller) {
          content = t('meets.status_you_early_end');
        } else {
          content = t('meets.status_invited_early_end');
        }
        break;
      }
      case IStatusMeet.FAIL: {
        content = t('meets.status_meet_failed');
        color = COLORS.pastelRed;
        break;
      }
      case IStatusMeet.PENDING: {
        color = COLORS.pastelYellow;
        content = t('meets.status_call_pending');
        break;
      }
      case IStatusMeet.READY: {
        content = t('meets.status_calling_now');
        color = COLORS.pastelYellow;
        break;
      }
    }
    return {color, content};
  }, [item.statusMeet]);

  return (
    <LinearGradient {...Screen.linearBackground} style={{flex: 1}}>
      <CommonHeader
        title={t('meets.meet_details')}
        containerStyle={[
          styles.header,
          {
            height: top + resWidth(44),
          },
        ]}
      />
      <View style={styles.container}>
        <View
          style={{
            flexDirection: 'row',
            paddingBottom: SPACING.m_16,
            alignItems: 'center',
          }}>
          <View style={styles.fristCol}>
            {avatar ? (
              <Avatar.Image source={{uri: avatar}} size={resWidth(80)} />
            ) : (
              <Logo size={SPACING.xl_56} />
            )}
          </View>
          <Text variant="headlineLarge" style={styles.txtName}>
            {nameMeeter}
          </Text>
        </View>
        <View style={{flexDirection: 'row', paddingBottom: SPACING.m_16}}>
          <Text style={styles.fristCol}>{t('meets.label_location')}</Text>
          <View style={{flex: 1, paddingLeft: SPACING.s_6}}>
            <Text style={styles.secondCol}>{item.address}</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', paddingBottom: SPACING.m_16}}>
          <Text style={styles.fristCol}>{t('meets.label_time')}</Text>
          <View style={{flex: 1, paddingLeft: SPACING.s_6}}>
            <Text style={styles.secondCol}>
              {moment
                .unix(item.createdAtTimestamp)
                .format('DD-MM-YYYY HH:mm:ss')}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', paddingBottom: SPACING.m_16}}>
          <Text style={styles.fristCol}>{t('meets.label_status')}</Text>
          <View style={{flex: 1, paddingLeft: SPACING.s_6}}>
            <Text style={{...styles.secondCol, color: dataStatus.color}}>
              {dataStatus.content}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', paddingBottom: SPACING.m_16}}>
          <Text style={styles.fristCol}>{t('meets.label_point')}</Text>
          <View style={{flex: 1, paddingLeft: SPACING.s_6}}>
            <Text style={{...styles.secondCol, color: dataStatus.color}}>
              {bonusMeetPoint || 0}
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};
export default HistoryMeetDetail;
