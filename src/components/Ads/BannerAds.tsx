import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import AdsManager from 'manager/adsManager';

const BannerAdsComponent = ({ size = BannerAdSize.BANNER }) => {
  const [adUnitId, setAdUnitId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeAds = async () => {
      try {
        if (!AdsManager.isInitialized()) {
          console.log('BannerAds - Initializing AdsManager...');
          await AdsManager.initialize();
        }
        const unitId = AdsManager.getBannerAdUnitId();
        console.log('BannerAds - Got ad unit ID:', unitId);
        setAdUnitId(unitId);
        setIsReady(true);
      } catch (error) {
        console.error('BannerAds - Failed to initialize:', error);
      }
    };
    initializeAds();
  }, []);

  if (!isReady || !adUnitId) {
    console.log('BannerAds - Not showing:', { isReady, adUnitId: !!adUnitId });
    return null;
  }

  return (
    <View style={styles.container}>
      <BannerAd
        unitId={adUnitId}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => {
          console.log('Banner ad loaded successfully');
        }}
        onAdFailedToLoad={(error) => console.error('Banner ad failed to load:', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default BannerAdsComponent;