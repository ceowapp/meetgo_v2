import { AppState, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import Config from 'react-native-config';

class AdsManager {
 static instance = null;
 
 constructor() {
   if (AdsManager.instance) {
     return AdsManager.instance;
   }
   
   AdsManager.instance = this;
   this.initialized = false;
   this.testMode = Config.IS_TEST_MODE === 'true' || __DEV__;
 }
 
 static TEST_IDS = {
   BANNER: 'ca-app-pub-3940256099942544/6300978111',
   INTERSTITIAL: 'ca-app-pub-3940256099942544/1033173712',
   REWARDED: 'ca-app-pub-3940256099942544/5224354917',
 };
 
 static PRODUCTION_IDS = {
   BANNER: Config.ADMOB_BANNER_ID || '',
   INTERSTITIAL: Config.ADMOB_INTERSTITIAL_ID || '',
   REWARDED: Config.ADMOB_REWARDED_ID || '',
 };
 
 async checkTrackingPermission() {
   if (Platform.OS === 'ios') {
     const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
     if (result === RESULTS.DENIED) {
       await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
     }
   }
 }
 
 getAdUnitId(adType) {
   if (this.testMode) {
     return AdsManager.TEST_IDS[adType];
   }
   return AdsManager.PRODUCTION_IDS[adType];
 }
 
 async initialize() {
   if (this.initialized) {
     console.log('AdMob already initialized');
     return;
   }
   
   try {
     //await this.checkTrackingPermission();
     const adapterStatuses = await mobileAds().initialize();
     const requestConfig = {
       maxAdContentRating: MaxAdContentRating.PG,
       tagForChildDirectedTreatment: false,
       tagForUnderAgeOfConsent: false,
     };
     await mobileAds().setRequestConfiguration(requestConfig);
     this.initialized = true;
     console.log('AdMob initialized successfully');
     return adapterStatuses;
   } catch (error) {
     console.error('Failed to initialize AdMob:', error);
     throw error;
   }
 }
 
 getBannerAdUnitId() {
   return this.getAdUnitId('BANNER');
 }
 
 getInterstitialAdUnitId() {
   return this.getAdUnitId('INTERSTITIAL');
 }
 
 getRewardedAdUnitId() {
   return this.getAdUnitId('REWARDED');
 }
}

export default new AdsManager();