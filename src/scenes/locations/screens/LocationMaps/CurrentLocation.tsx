import React, {
  forwardRef,
  ReactElement,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import {Permission} from 'manager/appPermission';
import {RESULTS} from 'react-native-permissions';
import Geolocation from 'react-native-geolocation-service';
import {ILocation} from 'scenes/locations/redux/type';
import {IActionCurrentLocation} from './types';
import {useAppDispatch, useAppSelector} from 'storeConfig/hook';
import {appStateSelector} from 'services/appstate/slice';
import {locationActions} from 'services/location/slice';

type IPropsMarkerCurrent = {
  updateRegionMap: (data: ILocation) => void;
};
const MarkerCurrentLocation = forwardRef(
  (
    props: IPropsMarkerCurrent,
    ref: Ref<IActionCurrentLocation>,
  ): ReactElement => {
    const [currentLocation, updateCurrentLocation] = useState<
      ILocation | undefined
    >();
    const dispatch = useAppDispatch();
    const appState = useAppSelector(appStateSelector.getAppState);

    const getCurrentLocation = () => currentLocation || ({} as ILocation);
    const listParent = (): IActionCurrentLocation => ({
      getCurrentLocation,
    });
    useImperativeHandle(ref, listParent);

    useEffect(() => {
      if (appState === 'active') {
        requestCurrentLocation();
      }
    }, [appState]);

    const updateCurrentLocationForMap = (
      currentPosition: Geolocation.GeoPosition,
    ) => {
      if (currentPosition) {
        const dataLocation: ILocation = {
          latitude: currentPosition.coords.latitude,
          longitude: currentPosition.coords.longitude,
        };
        updateCurrentLocation(dataLocation);
        props.updateRegionMap(dataLocation);
      }
    };

    const getCurrentError = (error: Geolocation.GeoError) => {
      console.error(error);
    };

    const requestCurrentLocation = async (): Promise<void> => {
      try {
        const permission = await Permission.checkPermission('location');
        if (permission === RESULTS.GRANTED) {
          dispatch(locationActions.updatePermissionLocation(permission));
          Geolocation.getCurrentPosition(
            updateCurrentLocationForMap,
            getCurrentError,
            {
              timeout: 10000,
              maximumAge: 10000,
              accuracy: {
                android: 'balanced',
                ios: 'best',
              },
              forceRequestLocation: true,
            },
          );
        } else {
          updateCurrentLocation(undefined);
        }
      } catch (e) {}
    };
    return <></>;
  },
);

export default MarkerCurrentLocation;
