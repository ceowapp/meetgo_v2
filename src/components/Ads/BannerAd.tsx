import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import AdManager from 'manager/adManager';

const BannerAdComponent = ({ size = BannerAdSize.BANNER }) => {
  return (
    <View style={styles.container}>
      <BannerAd
        unitId={AdManager.getBannerAdUnitId()}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => console.log('Banner ad loaded')}
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

export default BannerAdComponent;