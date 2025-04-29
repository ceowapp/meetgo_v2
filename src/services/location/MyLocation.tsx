import React, {useEffect, useState} from 'react';
import {ILocation} from 'scenes/locations/redux/type';
import {useAppDispatch, useAppSelector} from 'storeConfig/hook';
import Geolocation, {clearWatch} from 'react-native-geolocation-service';
import {locationActions, locationSelector} from './slice';
import {RESULTS} from 'react-native-permissions';
import {Permission} from 'manager/appPermission';
import database from '@react-native-firebase/database';
import {IDataFakeLocation} from 'scenes/meets/redux/types';

const watchConfig: Geolocation.GeoWatchOptions = {
  interval: 1000,
  distanceFilter: 100,
  accuracy: {
    android: 'balanced',
    ios: 'hundredMeters',
  },
  forceRequestLocation: true,
  showLocationDialog: true,
  showsBackgroundLocationIndicator: true,
};
const MyLocation = () => {
  const dispatch = useAppDispatch();
  const [currentLocation, setCurrentLocation] = useState<ILocation>();
  const dataFakeLocationStore = useAppSelector(
    locationSelector.getDataFakeLocation,
  );
  const permissionLocation = useAppSelector(
    locationSelector.getPermissionLocation,
  );
  const onWatchSuccess = (data: Geolocation.GeoPosition) => {
    console.tron.log('onWatchSuccess', data);
    if (data && data?.coords) {
      if (
        data.coords.latitude !== currentLocation?.latitude ||
        data.coords.longitude !== currentLocation.longitude
      ) {
        const dataUpdate = {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
        };
        setCurrentLocation(dataUpdate);
        dispatch(locationActions.updateLocation(dataUpdate));
      }
    }
  };
  const onWatchError = (err: Geolocation.GeoError) => {
    console.error('onWatchError', err);
  };

  const checkPermission = async () => {
    const permission = await Permission.checkPermission('location');
    if (permission === RESULTS.GRANTED) {
      dispatch(locationActions.updatePermissionLocation(permission));
    }
  };

  useEffect(() => {
    checkPermission();
    const meetingPath = `ConfigData/LOCATION_FAKE`;
    const reference = database()
      .ref(meetingPath)
      .on('value', snapShot => {
        if (snapShot.exists()) {
          const dataFakeLocation = snapShot.val() as IDataFakeLocation;
          if (dataFakeLocation.isFake) {
            dispatch(locationActions.updateFakeLocation(dataFakeLocation));
          } else {
            if (dataFakeLocationStore) {
              dispatch(locationActions.updateFakeLocation(null));
            }
          }
        }
      });
    return () => {
      database().ref(meetingPath).off('value', reference);
    };
  }, []);
  useEffect(() => {
    console.tron.log(permissionLocation);
    if (permissionLocation === RESULTS.GRANTED) {
      const idWatch = Geolocation.watchPosition(
        onWatchSuccess,
        onWatchError,
        watchConfig,
      );
      return () => {
        if (idWatch && clearWatch) {
          clearWatch(idWatch);
        }
      };
    }
  }, [permissionLocation]);
  return <></>;
};
export default MyLocation;
