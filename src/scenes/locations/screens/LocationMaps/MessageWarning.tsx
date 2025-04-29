import {ButtonPrimary} from 'components/Button/Primary';
import {Permission} from 'manager/appPermission';
import React, {memo, useEffect, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {PermissionStatus, RESULTS} from 'react-native-permissions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {appStateSelector} from 'services/appstate/slice';
import {locationActions} from 'services/location/slice';
import {useAppDispatch, useAppSelector} from 'storeConfig/hook';
import {perWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.secondary80,
    paddingVertical: SPACING.s_12,
    paddingHorizontal: SPACING.s_12,
    flexDirection: 'row',
    alignSelf: 'center',
    width: perWidth(100) - SPACING.s_12 * 2,
    alignItems: 'center',
    borderRadius: SPACING.s_12,
    marginTop: SPACING.l_32,
  },
  content: {
    color: COLORS.white,
    flex: 1,
  },
  iconWarning: {
    paddingRight: SPACING.s_12,
  },
});
const MessageWarning = () => {
  const { t } = useTranslation();
  const [resultPermission, setResultPermission] = useState<PermissionStatus>();
  const appStateHanler = useAppSelector(appStateSelector.getAppState);
  const dispatch = useAppDispatch();
  const checkPermissionLocation = async () => {
    const result = await Permission.checkPermission('location');
    setResultPermission(result);
  };
  const requestPermissionLocation = async () => {
    const result = await Permission.requestPermission('location');
    setResultPermission(result);
  };
  const openLocation = () => {
    Linking.openSettings();
  };

  useEffect(() => {
    if (resultPermission === RESULTS.DENIED) {
      requestPermissionLocation();
    } else if (resultPermission === RESULTS.GRANTED) {
      dispatch(locationActions.updatePermissionLocation(resultPermission));
    }
  }, [resultPermission]);

  useEffect(() => {
    if (appStateHanler === 'active') {
      checkPermissionLocation();
    }
  }, [appStateHanler]);

  if (resultPermission === RESULTS.GRANTED) return null;

  return (
    <View style={styles.container}>
      <Icon
        name="alert"
        size={SPACING.l_24}
        color={COLORS.primaryYellow}
        style={styles.iconWarning}
      />
      <Text variant="labelSmall" style={styles.content}>
        {t('location.grant_permission_message')}
      </Text>
      <ButtonPrimary content={t('location.agree')} onPress={openLocation} type="tiny" />
    </View>
  );
};
export default memo(MessageWarning);
