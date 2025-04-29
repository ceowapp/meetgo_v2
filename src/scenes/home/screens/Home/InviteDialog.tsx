import {ButtonPrimary} from 'components/Button/Primary';
import LottieView from 'lottie-react-native';
import {Permission} from 'manager/appPermission';
import React, {FC, useLayoutEffect, useState} from 'react';
import {Alert, Linking, View} from 'react-native';
import {Text} from 'react-native-paper';
import {RESULTS} from 'react-native-permissions';
import {ILocation} from 'scenes/locations/redux/type';
import {useMeet} from 'scenes/meets/helper/useMeet';
import {
  IDataConnect,
  IReqInvitedSendConfirm,
  IReqRejectMeeting,
} from 'scenes/meets/redux/types';
import Images from 'utils/Images';
import {perWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import Geolocation from 'react-native-geolocation-service';
import {useAppDispatch, useAppSelector} from 'storeConfig/hook';
import {AuthSelector} from 'scenes/auth/redux/slice';
import {hideModal} from 'services/globalModal/modalHandler';
import {pushScreen} from 'navigation/RootNavigation';
import {STACK_NAVIGATOR} from 'navigation/types';
import {locationActions, locationSelector} from 'services/location/slice';
import { useTranslation } from 'react-i18next';

type IPropsInvite = {
  dataInvite: IDataConnect;
};
const InviteDialog: FC<IPropsInvite> = ({dataInvite}) => {
  const { t } = useTranslation();
  const contentInvite = t('home.invite_meet', {
    firstName: dataInvite.firstnameAccountInvite,
    lastName: dataInvite.lastnameAccountInvite,
  });
  const [loading, setLoading] = useState<boolean>(false);
  const account = useAppSelector(AuthSelector.getAccount);
  const {sendConfirmInvited, rejectInvited} = useMeet();
  const [errorMessage, setErrorMessage] = useState('');
  const [currentLocation, setCurrentLocation] = useState<ILocation>();
  const dataFakeLocation = useAppSelector(locationSelector.getDataFakeLocation);
  const dispatch = useAppDispatch();
  useLayoutEffect(() => {
    requestCurrentLocation();
  }, []);
  const requestCurrentLocation = async (
    callbackAction?: (location: ILocation) => void,
  ): Promise<void> => {
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
            callbackAction && callbackAction(dataLocation);
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
  const onReject = () => {
    const dataPayload: IReqRejectMeeting = {
      account,
      connectId: dataInvite.connectId,
    };
    rejectInvited(dataPayload);
    hideModal();
  };
  const callbackSendConfirm = async (currentLocation: ILocation) => {
    setLoading(true);
    const dataPayload: IReqInvitedSendConfirm = {
      currentLat: currentLocation?.latitude,
      currentLong: currentLocation?.longitude,
      account,
      connectId: dataInvite.connectId,
      accountInvite: dataInvite.accountInvite,
    };
    const resDataConfirm = await sendConfirmInvited(dataPayload);
    if (resDataConfirm.status) {
      hideModal();
      pushScreen(STACK_NAVIGATOR.MEET_TOGETHER, {
        connectId: dataInvite.connectId,
      });
    } else {
      setErrorMessage(resDataConfirm.message);
    }
    setLoading(false);
  };
  const onConfirm = async () => {
    if (dataFakeLocation) {
      callbackSendConfirm({
        longitude: dataFakeLocation.currentLong,
        latitude: dataFakeLocation.currentLat,
      });
    } else if (currentLocation) {
      callbackSendConfirm(currentLocation);
    } else {
      Alert.alert(
        t('home.permission_alert_title'),
        t('home.permission_alert_message'),
        [
          {
            text: t('home.permission_alert_later'),
            style: 'destructive',
          },
          {
            text: t('home.permission_alert_now'),
            onPress: () => requestCurrentLocation(callbackSendConfirm),
          },
        ],
      );
    }
  };
  return (
    <View
      style={{
        backgroundColor: COLORS.white,
        padding: SPACING.l_24,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: SPACING.s_12,
      }}>
      <LottieView
        loop
        autoPlay
        source={Images.animation.ringing}
        style={{width: perWidth(30), aspectRatio: 1}}
      />
      <Text
        variant="headlineSmall"
        style={{
          paddingVertical: SPACING.s_12,
          textAlign: 'center',
          color: COLORS.primaryBlack,
        }}>
        {contentInvite}
      </Text>
      {errorMessage && (
        <Text
          variant="labelSmall"
          style={{
            paddingBottom: SPACING.s_12,
            textAlign: 'center',
            color: COLORS.error,
          }}>
          {errorMessage}
        </Text>
      )}
      <View style={{flexDirection: 'row'}}>
        <ButtonPrimary
          content={t('home.reject')}
          containerStyle={{flex: 1, backgroundColor: COLORS.red}}
          onPress={onReject}
          disabled={loading}
        />
        <View style={{width: SPACING.l_32}} />
        <ButtonPrimary
          content={t('home.confirm')}
          containerStyle={{flex: 1}}
          onPress={onConfirm}
          disabled={loading}
        />
      </View>
    </View>
  );
};
export default InviteDialog;
