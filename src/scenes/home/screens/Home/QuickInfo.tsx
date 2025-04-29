import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import {COLORS, SPACING} from 'utils/styleGuide';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppSelector} from 'storeConfig/hook';
import {AuthSelector} from 'scenes/auth/redux/slice';
import {AccountSelector} from 'scenes/account/redux/slice';
import {perWidth, resFont, resWidth} from 'utils/Screen';
import Clipboard from '@react-native-clipboard/clipboard';
import useToast from 'components/Toast/useToast';
import { useTranslation } from 'react-i18next';
import {shadow} from 'utils/mixins';

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.s_6,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowIcon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: resWidth(10),
    padding: SPACING.s_8,
    flex: 1,
    backgroundColor: COLORS.backgroundWhite10,
    ...shadow(),
  },
  txt: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(12),
    lineHeight: resWidth(14),
    textAlign: 'center',
    color: COLORS.white,
  },
  txtValue: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: resFont(12),
    lineHeight: resWidth(16),
    color: COLORS.white,
    textAlign: 'center',
  },
  wp5: {
    width: perWidth(5),
  },
  h6: {
    height: SPACING.s_6,
  },
  w130: {
    width: resWidth(130),
  },
  pr4: {
    paddingRight: SPACING.s_4,
  },
});
const QuickInfo = () => {
  const { t } = useTranslation();
  const account = useAppSelector(AuthSelector.getAccount);
  const getNumberOfMeet = useAppSelector(AccountSelector.getNumberOfMeet);
  const getNumberOfEarn = useAppSelector(AccountSelector.getNumberOfEarn);
  const getRefCode = useAppSelector(AccountSelector.getRefCode);
  const {addToast} = useToast();
  const copyAccount = () => {
    Clipboard.setString(account);
    addToast({
      message: t('home.copy_account_success'),
      type: 'SUCCESS_V3',
      position: 'top',
    });
  };
  const copyRefCode = () => {
    Clipboard.setString(getRefCode || '');
    addToast({
      message: t('home.copy_ref_code_success'),
      type: 'SUCCESS_V3',
      position: 'top',
    });
  };
  const renderAccountInfo = () => (
    <View style={[styles.itemContainer, styles.w130]}>
      <Text style={styles.txt}>{t('home.your_account')}</Text>
      <TouchableOpacity style={styles.rowIcon} onPress={copyAccount}>
        <Text style={[styles.txtValue, styles.pr4]}>{account}</Text>
        <Icon name="content-copy" size={resWidth(10)} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
  const renderRefCode = () => (
    <View style={[styles.itemContainer, styles.w130]}>
      <Text style={styles.txt}>{t('home.your_ref_code')}</Text>
      <TouchableOpacity style={styles.rowIcon} onPress={copyRefCode}>
        <Text style={[styles.txtValue, styles.pr4]}>{getRefCode}</Text>
        <Icon name="content-copy" size={resWidth(10)} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
  const renderNumberOfMeet = () => (
    <View style={styles.itemContainer}>
      <Text style={styles.txt}>{t('home.your_meet_count')}</Text>
      <Text style={styles.txtValue}>{getNumberOfMeet}</Text>
    </View>
  );
  const renderNumberOfEarn = () => (
    <View style={styles.itemContainer}>
      <Text style={styles.txt}>{t('home.your_earning_count')}</Text>
      <Text style={styles.txtValue}>{getNumberOfEarn}</Text>
    </View>
  );
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {renderAccountInfo()}
        <View style={styles.wp5} />
        {renderRefCode()}
      </View>
      <View style={styles.h6} />
      <View style={styles.row}>
        {renderNumberOfMeet()}
        <View style={styles.wp5} />
        {renderNumberOfEarn()}
      </View>
    </View>
  );
};

export default QuickInfo;
