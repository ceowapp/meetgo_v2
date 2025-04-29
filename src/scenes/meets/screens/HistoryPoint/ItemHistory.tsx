import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IResHistoryTransfer} from 'scenes/meets/redux/types';
import {shadow} from 'utils/mixins';
import {resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import { useTranslation } from 'react-i18next';

type IProps = {
  item: IResHistoryTransfer;
  account: string;
};
const styles = StyleSheet.create({
  title: {
    fontFamily: 'Roboto',
    fontSize: resFont(12),
    fontWeight: '400',
    lineHeight: resWidth(16),
    color: COLORS.white,
  },
  content: {
    fontFamily: 'Roboto',
    fontSize: resFont(12),
    lineHeight: resWidth(16),
    fontWeight: '700',
    color: COLORS.white,
  },
});
const ItemHistory: FC<IProps> = ({item, account}) => {
  const { t } = useTranslation();
  const isSender = item.accountSend === account;
  // const nameMeeter = isSender
  //   ? `${item.accountReceive}`
  //   : `${item.accountSend}`;
  const color = isSender ? COLORS.pastelRed : COLORS.pasteGreen;
  const titleSender = isSender ? t('meets.receiver') : t('meets.sender');
  const messageReceive = t('meets.history_transfer_received', {
    amount: item.amount,
    from: item.accountSend,
  });
  const messageSent = t('meets.history_transfer_sent', {
    amount: item.amount,
    to: item.accountReceive,
  });
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingVertical: SPACING.s_12,
        paddingHorizontal: SPACING.m_16,
        borderRadius: SPACING.s_8,
        alignItems: 'center',
        backgroundColor: COLORS.backgroundWhite10,
        ...shadow(),
      }}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingBottom: SPACING.l_24,
          }}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>{t('meets.history_date')}</Text>
            <Text style={styles.content}>{item.createdAt}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.title}>{t('meets.num_of_Meetpoint')}</Text>
            <Text style={[styles.content, {color}]}>
              {isSender ? `-${item.amount}` : `+${item.amount}`}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <Text style={styles.title}>{titleSender}</Text>
            <Text style={styles.content}>{item.accountSend}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.title}>{t('meets.content')}</Text>
            <Text style={styles.content} numberOfLines={3}>
              {isSender ? messageSent : messageReceive}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};
export default ItemHistory;
