import {ButtonPrimary} from 'components/Button/Primary';
import React, {FC} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {IDataEarn} from 'scenes/earn/redux/types';
import {hideModal} from 'services/globalModal/modalHandler';
import {resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import {useTranslation} from 'react-i18next';

type IProps = {
  dataEarn: IDataEarn;
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: SPACING.l_24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: resWidth(10),
  },
  label: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(12),
    lineHeight: resWidth(16),
    color: '#1155CC',
    flex: 0.5,
  },
  content: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: resFont(12),
    lineHeight: resWidth(16),
    color: '#1155CC',
    flex: 1,
  },
  rowContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
});
const EarnDetailDialog: FC<IProps> = ({dataEarn}) => {
  const {t} = useTranslation();
  const color = dataEarn.statusEarn === 'FAIL' ? COLORS.error : COLORS.green;
  return (
    <View style={styles.container}>
      <View style={styles.rowContent}>
        <Text style={styles.label}>{t('earn.location')}</Text>
        <Text style={styles.content}>{dataEarn.address}</Text>
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.label}>{t('earn.time')}</Text>
        <Text style={styles.content}>{dataEarn.createdAt}</Text>
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.label}>{t('earn.status')}</Text>
        <Text style={[styles.content, {color}]}>{dataEarn.statusMessage}</Text>
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.label}>{t('earn.points')}</Text>
        <Text style={[styles.content, {color}]}>
          {dataEarn.meetpointForAccount || 0}
        </Text>
      </View>
      <ButtonPrimary content={t('earn.close')} onPress={() => hideModal()} />
    </View>
  );
};
export default EarnDetailDialog;
