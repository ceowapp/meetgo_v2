import {ButtonPrimary} from 'components/Button/Primary';
import {Permission} from 'manager/appPermission';
import React, {FC, useLayoutEffect, useState} from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import {RESULTS} from 'react-native-permissions';
import {ILocation} from 'scenes/locations/redux/type';
import Images from 'utils/Images';
import {resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import Geolocation from 'react-native-geolocation-service';
import {useAppDispatch, useAppSelector} from 'storeConfig/hook';
import {hideModal} from 'services/globalModal/modalHandler';
import {navigateScreen} from 'navigation/RootNavigation';
import {STACK_NAVIGATOR} from 'navigation/types';
import {locationActions, locationSelector} from 'services/location/slice';
import {IDataEarn} from 'scenes/earn/redux/types';
import useEarn from 'scenes/earn/helper/useEarn';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
type IPropsEarn = {
  dataEarn: IDataEarn;
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    padding: SPACING.l_24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SPACING.s_12,
  },
  title: {
    fontFamily: 'Roboto',
    fontSize: resFont(14),
    fontWeight: '700',
    lineHeight: resWidth(16),
    textAlign: 'center',
    color: COLORS.primary,
  },
  row: {
    flexDirection: 'row',
  },
  btnCancel: {flex: 1, backgroundColor: COLORS.red},
  w12: {
    width: SPACING.s_12,
  },
  btnOk: {
    flex: 1,
  },
  img: {
    width: resWidth(120),
    aspectRatio: 1,
  },
});
const EarningDialog: FC<IPropsEarn> = ({dataEarn}) => {
  const { t } = useTranslation();
  const contentEarn = t('home.earningAt', { address: dataEarn.address });
  const {cancelEarn} = useEarn();
  const [currentLocation, setCurrentLocation] = useState<ILocation>();
  const dataFakeLocation = useAppSelector(locationSelector.getDataFakeLocation);
  const dispatch = useAppDispatch();
  useLayoutEffect(() => {
    requestCurrentLocation();
  }, []);
  const requestCurrentLocation = async (): Promise<void> => {
    try {
      const permission = await Permission.requestPermission('location');
      if (permission === RESULTS.GRANTED) {
        dispatch(locationActions.updatePermissionLocation(permission));
        Geolocation.getCurrentPosition(
          dataGeoLocation => {
            const dataLocation = {
              latitude: dataGeoLocation.coords.latitude,
              longitude: dataGeoLocation.coords.longitude,
            };
            setCurrentLocation(dataLocation);
          },
          () => {},
          {
            timeout: 10000,
            maximumAge: 10000,
            accuracy: {
              android: 'balanced',
              ios: 'best',
            },
            enableHighAccuracy: true,
            forceRequestLocation: true,
          },
        );
      } else if (
        permission === RESULTS.BLOCKED ||
        permission === RESULTS.UNAVAILABLE
      ) {
        Linking.openSettings();
        setCurrentLocation(undefined);
      }
    } catch (e) {}
  };
  const onCancel = () => {
    if (dataFakeLocation) {
      cancelEarn({
        earnID: dataEarn.earnID,
        currentLat: dataFakeLocation?.currentLat,
        currentLong: dataFakeLocation?.currentLong,
      });
    } else if (currentLocation) {
      cancelEarn({
        earnID: dataEarn.earnID,
        currentLat: currentLocation?.latitude,
        currentLong: currentLocation?.longitude,
      });
    }
    hideModal();
  };

  const onConfirm = () => {
    hideModal();
    navigateScreen(STACK_NAVIGATOR.EARN, {
      locationID: dataEarn.locationID,
      address: dataEarn?.address,
      owner: dataEarn?.ownerLocation,
      dataEarn,
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{contentEarn}</Text>
      <FastImage
        source={Images.earn.background}
        resizeMode="contain"
        style={styles.img}
      />
      <View style={styles.row}>
        <ButtonPrimary
          content={t('home.reject')}
          containerStyle={styles.btnCancel}
          onPress={onCancel}
        />
        <View style={styles.w12} />
        <ButtonPrimary
          content={t('home.accept')}
          containerStyle={styles.btnOk}
          onPress={onConfirm}
        />
      </View>
    </View>
  );
};
export default EarningDialog;
