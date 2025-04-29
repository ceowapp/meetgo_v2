import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {EStatusLocation, LocationInfo} from 'scenes/locations/redux/type';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetBackgroundProps,
  BottomSheetView,
  useBottomSheetDynamicSnapPoints,
} from '@gorhom/bottom-sheet';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Screen, {perHeight, resFont, resWidth} from 'utils/Screen';
import {getSoftMenuBarHeight} from 'react-native-extra-dimensions-android';
import Platform from 'utils/Platform';
import {calculatePercentMeet, openMapApp} from 'utils/Utility';
import {Animated, StyleSheet, TouchableOpacity, View} from 'react-native';
import {COLORS, SPACING} from 'utils/styleGuide';
import IconLocation from './IconLocation';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from 'react-native-paper';
import {ButtonPrimary} from 'components/Button/Primary';
import FastImage from 'react-native-fast-image';
import {ProgressiveImage} from 'components/Image/ProgressiveImage';
import LinearGradient from 'react-native-linear-gradient';
import {interpolateColor, useAnimatedStyle} from 'react-native-reanimated';
type IPropsLocationInfo = {
  dataSelectedLocation: LocationInfo | null;
  onNavigateLocationDetail: () => void;
  onNavigateEarning: () => void;
};
enum EBottomValue {
  CLOSE = -1,
  OPEN = 1,
}

const BottomSheetLocationInfo: FC<IPropsLocationInfo> = ({
  dataSelectedLocation,
  onNavigateLocationDetail,
  onNavigateEarning,
}) => {
  const [index, setIndex] = useState(EBottomValue.CLOSE);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%'], []);

  useEffect(() => {
    if (dataSelectedLocation) {
      setIndex(EBottomValue.OPEN);
    }
  }, [dataSelectedLocation]);

  const onOpenMap = () => {
    if (dataSelectedLocation) {
      openMapApp(dataSelectedLocation.latitude, dataSelectedLocation.longitude);
    }
  };

  const onClose = useCallback(() => {
    setIndex(EBottomValue.CLOSE);
  }, []);

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} />
  );

  // const renderImageLocation = () => {
  //   if (!dataSelectedLocation?.imageShopLocation) return <></>;
  //   return (
  //     <ProgressiveImage
  //       source={{
  //         uri: dataSelectedLocation?.imageShopLocation,
  //       }}
  //       resizeMode="cover"
  //       style={styles.img}
  //     />
  //   );
  // };

  // const {
  //   animatedHandleHeight,
  //   animatedSnapPoints,
  //   animatedContentHeight,
  //   handleContentLayout,
  // } = useBottomSheetDynamicSnapPoints(snapPoints);
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={index}
      enableDynamicSizing
      enableOverDrag
      snapPoints={snapPoints}
      handleStyle={styles.handleStyle}
      handleIndicatorStyle={styles.handleIndicator}
      // backgroundComponent={CustomBackground}
      // handleHeight={animatedHandleHeight}
      // contentHeight={animatedContentHeight}
      backdropComponent={renderBackdrop}
      onClose={onClose}>
      <LinearGradient
        {...Screen.linearBackground}
        start={{x: 0, y: 0}}
        end={{x: 0.1, y: 1.1}}
        style={styles.container}>
        <BottomSheetView
          // onLayout={handleContentLayout}
          style={styles.bottomContainer}>
          {/* {renderImageLocation()} */}
          <View style={styles.addressContainer}>
            {dataSelectedLocation?.statusLocation ? (
              <IconLocation
                statusLocation={dataSelectedLocation.statusLocation}
              />
            ) : (
              <Icon name="pin" color={COLORS.white} size={SPACING.m_16} />
            )}
            <View style={styles.addressItem}>
              <Text style={styles.txtAddress} numberOfLines={2}>
                {dataSelectedLocation?.address}
              </Text>
              <View style={styles.containProperties}>
                <View style={styles.distanceContainer}>
                  <Icon
                    name="map-marker-outline"
                    size={SPACING.m_16}
                    color={COLORS.white}
                  />
                  <Text style={styles.txtProperties}>
                    {dataSelectedLocation?.distanceInKm ?? 'N/A'} km
                  </Text>
                </View>
                <View style={{width: SPACING.l_32}} />
                <View style={styles.distanceContainer}>
                  <Icon
                    name="gift-outline"
                    size={SPACING.m_16}
                    color={COLORS.white}
                  />
                  <View style={{width: SPACING.s_4}} />
                  <Text style={styles.txtProperties}>
                    {dataSelectedLocation?.totalOfMeet
                      ? calculatePercentMeet(dataSelectedLocation.totalOfMeet)
                      : 0}
                    %
                  </Text>
                </View>
                <View style={{width: SPACING.l_32}} />
                {dataSelectedLocation &&
                  dataSelectedLocation.statusLocation ===
                    EStatusLocation.SHOP && (
                    <View style={styles.distanceContainer}>
                      <Icon
                        name="cash"
                        size={SPACING.m_16}
                        color={COLORS.white}
                      />
                      <View style={{width: SPACING.s_4}} />
                      <Text style={styles.txtProperties}>
                        {dataSelectedLocation?.totalOfMeet
                          ? calculatePercentMeet(
                              dataSelectedLocation.totalOfEarn,
                            )
                          : 0}
                        %
                      </Text>
                    </View>
                  )}
              </View>
              <TouchableOpacity onPress={onNavigateLocationDetail}>
                <Text style={styles.txtDetail}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.bottomBtnContainer}>
            <ButtonPrimary
              type="tiny"
              onPress={onOpenMap}
              containerStyle={styles.btnDirection}
              content={<Text style={styles.txtBtn}>Dẫn đường tới đây</Text>}
            />
            <View style={styles.w16} />
            {dataSelectedLocation &&
              dataSelectedLocation.statusLocation === EStatusLocation.SHOP && (
                <>
                  <View style={styles.w16} />
                  <ButtonPrimary
                    type="tiny"
                    containerStyle={styles.btnEarn}
                    onPress={onNavigateEarning}
                    content={<Text style={styles.txtBtn}>Earning</Text>}
                  />
                </>
              )}
          </View>
        </BottomSheetView>
      </LinearGradient>
    </BottomSheet>
  );
};

export default BottomSheetLocationInfo;
const styles = StyleSheet.create({
  container: {flex: 1, borderRadius: 10},
  bottomContainer: {
    padding: resWidth(40),
  },
  handleStyle: {
    position: 'absolute',
    width: '100%',
  },
  handleIndicator: {
    backgroundColor: '#E5E5E5',
    height: 2,
  },
  addressContainer: {
    flexDirection: 'row',
  },
  addressItem: {
    flex: 1,
    paddingLeft: SPACING.m_16,
  },
  bottomBtnContainer: {
    flexDirection: 'row',
    flex: 1,
    paddingTop: resWidth(18),
  },
  btnDirection: {
    paddingHorizontal: SPACING.s_8,
    paddingVertical: SPACING.s_6,
    flex: 1,
    height: resWidth(42),
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  btnEarn: {
    paddingHorizontal: SPACING.s_8,
    paddingVertical: SPACING.s_6,
    flex: 1,
    height: resWidth(42),
    backgroundColor: COLORS.green,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
  },
  containProperties: {
    paddingHorizontal: SPACING.s_4,
    paddingVertical: SPACING.s_6,
    flexDirection: 'row',
  },
  txtProperties: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(12),
    lineHeight: resWidth(16),
    color: COLORS.white,
  },
  txtBtn: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: resFont(12),
    lineHeight: resWidth(16),
    color: COLORS.white,
  },
  txtAddress: {
    fontFamily: 'Roboto-Bold',
    fontWeight: '700',
    fontSize: resFont(14),
    lineHeight: resWidth(16),
    color: COLORS.white,
  },
  txtDetail: {
    fontFamily: 'Roboto',
    fontStyle: 'italic',
    fontSize: resFont(12),
    lineHeight: resWidth(16),
    color: COLORS.white,
    textDecorationLine: 'underline',
  },
  w16: {
    width: SPACING.m_16,
  },
});
