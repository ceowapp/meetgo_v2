import React from 'react';
import MapView, {PROVIDER_GOOGLE, Region} from 'react-native-maps';

import {useCallback, useMemo, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {COLORS, SPACING} from 'utils/styleGuide';
import Container from 'components/Container';
import {shadow} from 'utils/mixins';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {AppStackParamList, STACK_NAVIGATOR} from 'navigation/types';
import appConstant from 'constant/appConstant';
import {
  ILocation,
  IReqNearByMap,
  LocationInfo,
} from 'scenes/locations/redux/type';
import CurrentLocation from './CurrentLocation';
import ListMarkerLocation from './ListMarkerLocation';
import {IActionCurrentLocation, IActionMarkerLocation} from './types';
import MessageWarning from './MessageWarning';
import BottomSheetLocationInfo from './BottomSheetLocationInfo';
import {useEffectAfterTransition} from 'utils/Utility';
import Platform from 'utils/Platform';

export default function LocationMapScreens() {
  const {goBack, navigate} = useNavigation();

  const {params} =
    useRoute<RouteProp<{locationNFT?: AppStackParamList['LOCATION_MAP']}>>();

  const [dataSelectedLocation, setDataSelectedLocation] =
    useState<LocationInfo | null>(params?.locationNFT || null);
  const mapRef = useRef<MapView | null>();
  const deltaRef = useRef({
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  });
  const centerLatLongRef = useRef({
    latitude: 0,
    longitude: 0,
  });

  const markerRef = useRef<IActionMarkerLocation>(null);
  const currentLocationRef = useRef<IActionCurrentLocation>(null);

  const onShowSelectedLocation = useCallback((location: LocationInfo) => {
    mapRef.current?.animateToRegion(
      {
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: deltaRef.current.latitudeDelta,
        longitudeDelta: deltaRef.current.longitudeDelta,
      },
      300,
    );
    // check permission again and caculate distance
    const getCurrentLatLg = currentLocationRef.current?.getCurrentLocation();
    let dataLocation: LocationInfo = location;
    setDataSelectedLocation(location);
  }, []);

  const onMovingCurrentRegion = (location: ILocation) => {
    // just moving when user not click from list location near by me
    if (!dataSelectedLocation) {
      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: deltaRef.current.latitudeDelta,
            longitudeDelta: deltaRef.current.longitudeDelta,
          },
          300,
        );
      }, 500);
    }
  };

  useEffectAfterTransition(() => {
    if (dataSelectedLocation && Platform.isAndroid) {
      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: dataSelectedLocation.latitude,
            longitude: dataSelectedLocation.longitude,
            latitudeDelta: deltaRef.current.latitudeDelta,
            longitudeDelta: deltaRef.current.longitudeDelta,
          },
          300,
        );
      }, 500);
    }
  }, []);

  // const onMoveMyLocation = () => {
  //   const getCurrentLatLg = currentLocationRef.current?.getCurrentLocation();
  //   if (getCurrentLatLg?.latitude && getCurrentLatLg.longitude) {
  //     mapRef.current?.animateToRegion(
  //       {
  //         latitude: getCurrentLatLg.latitude,
  //         longitude: getCurrentLatLg.longitude,
  //         latitudeDelta: deltaRef.current.latitudeDelta,
  //         longitudeDelta: deltaRef.current.longitudeDelta,
  //       },
  //       300,
  //     );
  //   }
  // };

  const onRegionChangeComplete = (region: Region) => {
    const getCurrentLatLg = currentLocationRef.current?.getCurrentLocation();
    const payloadRegionMap: IReqNearByMap = {
      mapLat: region.latitude,
      mapLong: region.longitude,
      currentLat: getCurrentLatLg?.latitude || '',
      currentLong: getCurrentLatLg?.longitude || '',
    };
    markerRef.current?.getMarketLocation(payloadRegionMap);
    deltaRef.current = {
      latitudeDelta: region.latitudeDelta,
      longitudeDelta: region.longitudeDelta,
    };
    centerLatLongRef.current = {
      latitude: region.latitude,
      longitude: region.longitude,
    };
  };

  const onNavigateLocationDetail = () => {
    // @ts-ignore
    navigate(STACK_NAVIGATOR.LOCATION_DETAIL, {
      locationData: dataSelectedLocation,
      regionCenter: centerLatLongRef.current,
    });
  };

  const onNavigateEarning = () => {
    // @ts-ignore
    navigate(STACK_NAVIGATOR.EARN, {
      locationID: dataSelectedLocation?.id,
      address: dataSelectedLocation?.address,
      owner: dataSelectedLocation?.owner,
      imageShopLocation: dataSelectedLocation?.imageShopLocation,
    });
  };

  const renderBackButton = useMemo(
    () => (
      <TouchableOpacity onPress={goBack} style={styles.backButton}>
        <Icon
          name="chevron-left"
          color={COLORS.primaryBlack}
          size={SPACING.l_32}
        />
      </TouchableOpacity>
    ),
    [],
  );

  const renderMapView = useMemo(() => {
    const regionLocation: Region = {
      latitude:
        dataSelectedLocation?.latitude ||
        appConstant.LOCATION_BEN_THANH.latitude,
      longitude:
        dataSelectedLocation?.longitude ||
        appConstant.LOCATION_BEN_THANH.longitude,
      latitudeDelta: deltaRef.current.latitudeDelta,
      longitudeDelta: deltaRef.current.longitudeDelta,
    };
    return (
      <MapView
        showsMyLocationButton
        showsBuildings={false}
        showsIndoors={false}
        showsUserLocation
        ref={ref => (mapRef.current = ref)}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        toolbarEnabled
        onRegionChangeComplete={onRegionChangeComplete}
        initialRegion={regionLocation}>
        <ListMarkerLocation
          ref={markerRef}
          selectLocation={onShowSelectedLocation}
        />
      </MapView>
    );
  }, [dataSelectedLocation]);

  return (
    <Container edges={['top']}>
      {renderMapView}
      {renderBackButton}
      <MessageWarning />
      <CurrentLocation
        ref={currentLocationRef}
        updateRegionMap={onMovingCurrentRegion}
      />
      <BottomSheetLocationInfo
        dataSelectedLocation={dataSelectedLocation}
        onNavigateLocationDetail={onNavigateLocationDetail}
        onNavigateEarning={onNavigateEarning}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    backgroundColor: COLORS.white,
    left: SPACING.l_24,
    top: SPACING.l_24,
    alignSelf: 'flex-start',
    borderRadius: SPACING.l_24,
    ...shadow('low', false),
  },
});
