import DialogModal from 'components/BaseModal/DialogModal';
import React, {FC, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IDataEarn} from 'scenes/earn/redux/types';
import {showDialogModal} from 'services/globalModal/modalHandler';
import {shadow} from 'utils/mixins';
import {resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import {useTranslation} from 'react-i18next';

type IProps = {
  item: IDataEarn;
  onClick: (item: IDataEarn) => void;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: SPACING.m_16,
    borderRadius: resWidth(10),
    alignItems: 'center',
    backgroundColor: COLORS.backgroundWhite10,
    ...shadow(),
  },
  row: {
    flexDirection: 'row',
    paddingTop: SPACING.s_8,
  },
  item: {
    flex: 1,
  },
  address: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: resFont(12),
    lineHeight: resWidth(18),
    color: COLORS.white,
    paddingLeft: SPACING.s_6,
  },
  date: {
    paddingLeft: SPACING.s_6,
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(12),
    lineHeight: resWidth(16),
    color: COLORS.white,
  },
});
const ItemHistory: FC<IProps> = ({item, onClick}) => {
  const {t} = useTranslation();
  const color =
    item.statusEarn === 'FAIL' ? COLORS.pastelRed : COLORS.pasteGreen;
  const status = item.statusEarn === 'FAIL' ? t('earn.fail') : t('earn.success');
  const onOpenDetail = () => onClick(item);
  return (
    <TouchableOpacity style={styles.container} onPress={onOpenDetail}>
      <View style={styles.item}>
        <View style={styles.row}>
          <Icon
            name="map-marker-outline"
            size={SPACING.m_16}
            color={COLORS.white}
          />
          <Text style={styles.address} numberOfLines={1}>
            {item.address}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="calendar" size={SPACING.m_16} color={COLORS.white} />
          <Text style={styles.date} numberOfLines={1}>
            {item.createdAt}
          </Text>
        </View>
        <View style={styles.row}>
          <Icon name="key" size={SPACING.m_16} color={COLORS.white} />
          <Text style={styles.date} numberOfLines={1}>
            {item.earnID}
          </Text>
        </View>
      </View>
      <View style={{width: 100}}>
        <Text style={[styles.address, {color, textAlign: 'right'}]}>
          {status}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
export default ItemHistory;
