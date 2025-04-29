import React, {
  forwardRef,
  memo,
  ReactElement,
  Ref,
  useCallback,
  useImperativeHandle,
} from 'react';
import {Marker, MarkerPressEvent} from 'react-native-maps';
import useLocationMap from 'scenes/locations/helper/useLocationMap';
import {
  ILocation,
  IReqNearByMap,
  IResNearByMap,
} from 'scenes/locations/redux/type';
import Platform from 'utils/Platform';
import Screen from 'utils/Screen';
import IconLocation from './IconLocation';
import {IActionMarkerLocation, IPropsListMarkerLocation} from './types';

const ListMarkerLocation = forwardRef(
  (
    props: IPropsListMarkerLocation,
    ref: Ref<IActionMarkerLocation>,
  ): ReactElement => {
    const {listLocationMap, getLocationNearByMap} = useLocationMap();

    const getMarketLocation = (data: IReqNearByMap) => {
      getLocationNearByMap(data);
    };
    const listParent = (): IActionMarkerLocation => ({
      getMarketLocation,
    });
    useImperativeHandle(ref, listParent);

    const onPressMarker = (locationInfo: IResNearByMap) => {
      props.selectLocation(locationInfo);
    };
    const renderListMarker = useCallback(() => {
      return (
        <>
          {listLocationMap?.map(location => {
            return (
              <Marker
                tracksViewChanges={Platform.isIos ? true : false}
                key={Math.random()}
                identifier={location.id}
                coordinate={location}
                hitSlop={Screen.hitSlop}
                onPress={() => onPressMarker(location)}>
                <IconLocation statusLocation={location.statusLocation} />
              </Marker>
            );
          })}
        </>
      );
    }, [listLocationMap]);
    return renderListMarker();
  },
);

export default memo(ListMarkerLocation);
