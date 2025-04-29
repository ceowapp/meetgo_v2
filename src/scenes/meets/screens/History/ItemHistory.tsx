import Logo from 'components/Logo';
import {IStatusMeet} from 'constant/commonType';
import moment from 'moment';
import React, {FC, useMemo} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IResHistoryMeet} from 'scenes/meets/redux/types';
import Images from 'utils/Images';
import {shadow} from 'utils/mixins';
import {resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import { useTranslation } from 'react-i18next';

type IProps = {
  item: IResHistoryMeet;
  account: string;
  onNavigateHistoryDetail: (item: IResHistoryMeet) => void;
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.backgroundWhite10,
    ...shadow(),
    borderRadius: resWidth(10),
    padding: SPACING.m_16,
  },
  img: {
    width: resWidth(14),
    height: resWidth(14),
  },
  avt: {
    marginLeft: SPACING.s_6,
  },
  txtAvt: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: resFont(14),
    color: COLORS.white,
    paddingLeft: SPACING.s_6,
  },
  txtConnect: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: resFont(12),
    lineHeight: SPACING.m_16,
    color: COLORS.white,
    paddingLeft: SPACING.s_6,
  },
  txtAddres: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(12),
    lineHeight: SPACING.m_16,
    color: COLORS.white,
    paddingLeft: SPACING.s_6,
  },
  txtStatus: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(12),
    flex: 0.4,
    textAlign: 'right',
    paddingTop: SPACING.s_12,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 62,
  },
  rowCaller: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: SPACING.s_6,
    // flex: 1,
  },
  rowAddress: {flexDirection: 'row', alignItems: 'center'},
  rowDate: {paddingTop: SPACING.s_6, flexDirection: 'row'},
});
const ItemHistory: FC<IProps> = ({item, account, onNavigateHistoryDetail}) => {
  const { t } = useTranslation();
  const isCaller = item.accountInvite === account;
  const nameMeeter = isCaller
    ? `${item.firstnameAccountInvited} ${item.lastnameAccountInvited}`
    : `${item.firstnameAccountInvite} ${item.lastnameAccountInvite}`;
  const avatar = isCaller ? item.imageAccountInvited : item.imageAccountInvite;
  const dataStatus = useMemo(() => {
    let color = COLORS.primaryYellow;
    let content = t('meets.status_waiting');
    switch (item.statusMeet) {
      case IStatusMeet.DONE:
      case IStatusMeet.PENDING_SUCCESS: {
        color = COLORS.pasteGreen;
        content = t('meets.status_success');
        break;
      }
      case IStatusMeet.INVITED_REJECT:
      case IStatusMeet.INVITE_REJECT:
      case IStatusMeet.INVITED_FAIL:
      case IStatusMeet.FAIL:
      case IStatusMeet.INVITE_FAIL: {
        color = COLORS.pastelRed;
        content = t('meets.status_meet_failed');
        break;
      }
      case IStatusMeet.PENDING: {
        color = COLORS.pastelYellow;
        content = t('meets.status_waiting');
        break;
      }
      case IStatusMeet.READY: {
        content = t('meets.status_calling');
        color = COLORS.pastelYellow;
        break;
      }
    }
    return {color, content};
  }, [item.statusMeet]);

  const onClick = () => onNavigateHistoryDetail(item);
  return (
    <TouchableOpacity onPress={onClick} style={styles.container}>
      <View style={styles.itemContent}>
        <View style={{flex: 1}}>
          <View style={styles.rowCaller}>
            <Image source={Images.icon.home.connect} style={styles.img} />
            {avatar ? (
              <Avatar.Image
                source={{uri: avatar}}
                size={SPACING.m_16}
                style={styles.avt}
              />
            ) : (
              <Logo />
            )}
            <Text style={styles.txtAvt} numberOfLines={1}>
              {nameMeeter}
            </Text>
          </View>
          <View style={styles.rowAddress}>
            <Image source={Images.icon.pin} style={styles.img} />
            <Text numberOfLines={1} style={styles.txtAddres}>
              {item.address}
            </Text>
          </View>
          <View style={styles.rowDate}>
            <Image source={Images.icon.birth} style={styles.img} />
            <Text style={styles.txtAddres}>
              {moment
                .unix(item.createdAtTimestamp)
                .format('DD-MM-YYYY HH:mm:ss')}
            </Text>
          </View>
          <View style={styles.rowDate}>
            <Icon name="key" size={resWidth(14)} color={COLORS.white} />
            <Text style={styles.txtAddres}>{item.connectId}</Text>
          </View>
        </View>
        <View style={{height: 62, width: 90}}>
          <View
            style={{
              alignItems: 'flex-end',
            }}>
            <Image source={Images.icon.threeDots} style={styles.img} />
          </View>
          <Text style={{color: dataStatus.color, ...styles.txtStatus}}>
            {dataStatus.content}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default ItemHistory;
