import {ButtonPrimary} from 'components/Button/Primary';
import moment from 'moment';
import React, {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {IDataHistoryMeet} from 'scenes/meets/redux/types';
import {hideModal} from 'services/globalModal/modalHandler';
import {resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import { useTranslation } from 'react-i18next';

type IWarningMeetProps = {
  data: IDataHistoryMeet;
  fullName: string;
  onInviteMeetUser: () => void;
  rateBonusAgain: number;
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: SPACING.l_32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: resWidth(10),
  },
  des: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(14),
    lineHeight: SPACING.m_16,
    textAlign: 'center',
    color: COLORS.primaryBlack,
  },
  name: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: resFont(14),
    lineHeight: SPACING.m_16,
    color: COLORS.primaryBlack,
  },
  date: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: resFont(14),
    lineHeight: SPACING.m_16,
    paddingVertical: SPACING.s_12,
    color: COLORS.primaryBlack,
  },
});
const WarningMeetDialog: FC<IWarningMeetProps> = ({
  data,
  fullName,
  onInviteMeetUser,
  rateBonusAgain,
}) => {
  const { t } = useTranslation();
  const timeMeet = moment
    .unix(data.createdAtTimestamp)
    .format('DD-MM-YYYY    HH:mm:ss');
  const onCancel = () => hideModal();
  const onConfirm = () => {
    hideModal();
    onInviteMeetUser();
  };
  return (
    <View style={styles.container}>
      <Text variant="titleSmall" style={styles.des}>
        {t('meets.warning_previous_meet_1')} {<Text style={styles.name}>{fullName}</Text>} {t('meets.warning_previous_meet_2')}{' '}
      </Text>
      <Text style={styles.date}>{timeMeet}</Text>
      <Text style={styles.des}>
        {t('meets.warning_rate_bonus_again')}{' '}
        {<Text style={styles.name}>{rateBonusAgain}%</Text>}
      </Text>
      <View style={{flexDirection: 'row', paddingTop: SPACING.l_24}}>
        <ButtonPrimary
          content={t('meets.warning_button_skip')}
          containerStyle={{flex: 1, backgroundColor: '#EB5A55'}}
          onPress={onCancel}
        />
        <View style={{width: SPACING.l_32}} />
        <ButtonPrimary
          content={t('meets.warning_button_continue')}
          containerStyle={{flex: 1}}
          onPress={onConfirm}
        />
      </View>
    </View>
  );
};

export default WarningMeetDialog;
