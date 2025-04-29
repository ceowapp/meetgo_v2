import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {ButtonPrimary} from 'components/Button/Primary';
import CommonHeader from 'components/CommonHeader';
import Container from 'components/Container';
import InputNormal from 'components/Input/InputNormal';
import {AppStackParamList} from 'navigation/types';
import React, {memo, useLayoutEffect} from 'react';
import {ImageBackground, ScrollView, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Platform from 'utils/Platform';
import Screen, {perWidth, resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import {openMapApp} from 'utils/Utility';
import IconLocation from '../LocationMaps/IconLocation';
import Images from 'utils/Images';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    paddingBottom: SPACING.m_16,
  },
  contentContainer: {
    paddingTop: SPACING.l_24,
    paddingHorizontal: SPACING.l_24,
  },
  containerMap: {
    width: perWidth(100) - 48,
    height: resWidth(276),
    paddingHorizontal: SPACING.l_24,
    paddingVertical: 24,
    marginBottom: SPACING.m_16,
  },
  borderMap: {
    borderRadius: resWidth(10),
    overflow: 'hidden',
    height: resWidth(250) - 24,
  },
  map: {
    width: '100%',
    aspectRatio: 1,
  },
  mapTitle: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(12),
    color: COLORS.white,
    marginTop: -SPACING.l_32 - 2,
    marginLeft: SPACING.s_6,
    paddingBottom: SPACING.s_12,
  },
  flex1: {flex: 1},
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.l_24,
    // backgroundColor: COLORS.onSecondary,
  },
  space16: {width: SPACING.m_16},
  input: {
    backgroundColor: COLORS.transparent,
  },
  btnDirect: {
    borderColor: COLORS.white,
    borderWidth: 1,
    flex: 1,
  },
  btnExplore: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    flex: 1,
  },
  titleExplore: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: resFont(14),
    color: COLORS.primary,
  },
  titleDirect: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: resFont(14),
    color: COLORS.white,
  },
});
const LocationDetail = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {params} = useRoute<RouteProp<AppStackParamList, 'LOCATION_DETAIL'>>();
  const {locationData, regionCenter} = params || {};
  const {top} = useSafeAreaInsets();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: locationData?.address || '',
    });
  }, []);

  const onOpenMap = () => {
    openMapApp(locationData.latitude, locationData.longitude);
  };

  const regionMap = {
    latitude: regionCenter?.latitude,
    longitude: regionCenter?.longitude,
    longitudeDelta: 0.03,
    latitudeDelta: 0.03,
  };

  const renderMap = () => {
    return (
      <ImageBackground
        style={styles.containerMap}
        resizeMode="contain"
        source={Images.nft.borderMap}>
        <Text variant="titleMedium" style={styles.mapTitle}>
          {t('location.map_image_area')}
        </Text>
        <MapView
          provider={PROVIDER_GOOGLE}
          scrollEnabled={false}
          style={styles.borderMap}
          loadingIndicatorColor={COLORS.secondary}
          loadingBackgroundColor={COLORS.secondary}
          region={regionMap}>
          <Marker
            tracksViewChanges={Platform.isIos ? true : false}
            coordinate={locationData}>
            <IconLocation statusLocation={locationData.statusLocation} />
          </Marker>
        </MapView>
      </ImageBackground>
    );
  };
  return (
    <LinearGradient
      {...Screen.linearBackground}
      style={{
        flex: 1,
      }}>
      {/* <View style={{flex: 1, backgroundColor: 'white'}}> */}
      <Container edges={['bottom']}>
        <CommonHeader
          title={locationData?.address}
          containerStyle={[
            styles.header,
            {
              height: top + resWidth(44),
            },
          ]}
        />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {renderMap()}
          <ImageBackground
            source={Images.nft.borderAddress}
            resizeMode="contain"
            style={{
              width: perWidth(100) - 48,
              height: resWidth(72),
              paddingHorizontal: SPACING.l_24,
              marginBottom: SPACING.m_16,
            }}>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontWeight: '400',
                fontSize: resFont(12),
                color: COLORS.white,
                marginTop: -SPACING.s_4,
                marginLeft: 16,
                paddingBottom: SPACING.s_8,
              }}>
              {t('location.place_name')}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'Roboto',
                fontWeight: '700',
                fontSize: resFont(14),
                color: COLORS.white,
                height: resWidth(40),
              }}>
              {locationData.visionAddress || locationData?.address}
            </Text>
          </ImageBackground>
          <ImageBackground
            source={Images.nft.borderOwner}
            resizeMode="contain"
            style={{
              width: perWidth(100) - 48,
              height: resWidth(40),
              paddingHorizontal: SPACING.l_24,
              marginBottom: SPACING.m_16,
            }}>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontWeight: '400',
                fontSize: resFont(12),
                color: COLORS.white,
                marginTop: -SPACING.s_6,
                marginLeft: 16,
                paddingBottom: SPACING.s_6,
              }}>
              {t('location.owner')}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'Roboto',
                fontWeight: '700',
                fontSize: resFont(12),
                color: COLORS.white,
                height: resWidth(40),
              }}>
              {locationData?.owner}
            </Text>
          </ImageBackground>
          <ImageBackground
            source={Images.nft.borderLat}
            resizeMode="contain"
            style={{
              width: perWidth(100) - 48,
              height: resWidth(40),
              paddingHorizontal: SPACING.l_24,
              marginBottom: SPACING.m_16,
            }}>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontWeight: '400',
                fontSize: resFont(12),
                color: COLORS.white,
                marginTop: -SPACING.s_6,
                marginLeft: 16,
                paddingBottom: SPACING.s_6,
              }}>
              {t('location.latitude')}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'Roboto',
                fontWeight: '700',
                fontSize: resFont(12),
                color: COLORS.white,
                height: resWidth(40),
              }}>
              {locationData?.latitude}
            </Text>
          </ImageBackground>
          <ImageBackground
            source={Images.nft.borderLat}
            resizeMode="contain"
            style={{
              width: perWidth(100) - 48,
              height: resWidth(40),
              paddingHorizontal: SPACING.l_24,
              marginBottom: SPACING.m_16,
            }}>
            <Text
              style={{
                fontFamily: 'Roboto',
                fontWeight: '400',
                fontSize: resFont(12),
                color: COLORS.white,
                marginTop: -SPACING.s_6,
                marginLeft: 16,
                paddingBottom: SPACING.s_6,
              }}>
              {t('location.longitude')}
            </Text>
            <Text
              numberOfLines={2}
              style={{
                fontFamily: 'Roboto',
                fontWeight: '700',
                fontSize: resFont(12),
                color: COLORS.white,
                height: resWidth(40),
              }}>
              {locationData?.longitude}
            </Text>
          </ImageBackground>
        </ScrollView>
        <View style={styles.bottomContainer}>
          <ButtonPrimary
            content={t('location.direction')}
            onPress={onOpenMap}
            titleStyle={styles.titleDirect}
            containerStyle={styles.btnDirect}
          />
          <View style={styles.space16} />
          <ButtonPrimary
            content={t('location.view_on_explorer')}
            titleStyle={styles.titleExplore}
            onPress={() => {}}
            containerStyle={styles.btnExplore}
          />
        </View>
      </Container>
      {/* </View> */}
    </LinearGradient>
  );
};
export default LocationDetail;
