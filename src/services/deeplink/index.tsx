import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config';
import appsFlyer from 'react-native-appsflyer';
import DeviceInfo from 'react-native-device-info';

export default class DeepLink {
  static async init() {
    try {
      const appsFlyerOptions = {
        devKey: Config.DEV_KEY,
        isDebug: Config.IS_TEST_MODE === 'true',
        appId: Config.IOS_APP_ID,
        onInstallConversionDataListener: true,
        onDeepLinkListener: true,
        onAppOpenAttributionListener: true,
      };

      appsFlyer.initSdk(appsFlyerOptions);

      appsFlyer.onDeepLink(deepLinkResult => {
        if (deepLinkResult?.status === 'success') {
          const deepLinkData = deepLinkResult.data;
          if (deepLinkData.af_refcode) {
            DeepLink.storeReferralCode(deepLinkData.af_refcode);
            console.log('Stored referral code from AppsFlyer:', deepLinkData.af_refcode);
          }
        }
      });

      const onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
        (res) => {
          if (JSON.parse(res.data.is_first_launch) == true) {
            if (res.data.af_status === 'Non-organic') {
              var media_source = res.data.media_source;
              var campaign = res.data.campaign;
              if (res.data.af_referrer_customer_id && res.data.af_refcode) {
                console.log("this is referralCode auth", res.data.af_refcode)
                DeepLink.storeReferralCode(res.data.af_refcode);
              }
              console.log('This is first launch and a Non-Organic install. Media source: ' + media_source + ' Campaign: ' + campaign);
            } else if (res.data.af_status === 'Organic') {
              console.log('This is first launch and a Organic Install');
            }
          } else {
            console.log('This is not first launch');
          }
        }
      );

      AsyncStorage.getItem('hasProcessedAppOpenAttribution').then(value => {
        if (value !== 'true') {
          appsFlyer.onAppOpenAttribution(attributionData => {
            const openAttributionData = attributionData?.data || {};
            console.log('AppsFlyer app open attribution data:', openAttributionData);
            if (openAttributionData.af_referrer_customer_id && openAttributionData.af_refcode) {
              DeepLink.storeReferralCode(openAttributionData.af_refcode);
              console.log('Stored referral code from app open attribution:', openAttributionData.af_refcode);
            }
            AsyncStorage.setItem('hasProcessedAppOpenAttribution', 'true');
          });
        }
      });

      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        DeepLink.handleUrl(initialUrl);
      }
      Linking.addEventListener('url', ({ url }) => {
        DeepLink.handleUrl(url);
      });
    } catch (err) {
      console.error('DeepLink Error - Failed to initialize:', err);
    }
  }

  static handleUrl(url) {
    if (!url) return;
    try {
      console.log('DeepLink - Handling URL:', url);
      const referralCode = DeepLink.extractReferralCode(url);
      if (referralCode) {
        DeepLink.storeReferralCode(referralCode);
        console.log('Stored referral code from URL:', referralCode);
      }
    } catch (err) {
      console.error('DeepLink Error - Failed to handle URL:', err, url);
    }
  }

  static extractReferralCode(url) {
    const match = url.match(/[?&]ref=([^&]+)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  static async storeReferralCode(code) {
    try {
      await AsyncStorage.setItem('REFERRAL_CODE', code);
    } catch (err) {
      console.error('DeepLink Error - Failed to store referral code:', err);
    }
  }

  static async getReferralCode() {
    try {
      return await AsyncStorage.getItem('REFERRAL_CODE');
    } catch (err) {
      console.error('DeepLink Error - Failed to retrieve referral code:', err);
      return null;
    }
  }

  static async clearReferralCode() {
    try {
      await AsyncStorage.removeItem('REFERRAL_CODE');
    } catch (err) {
      console.error('DeepLink Error - Failed to clear referral code:', err);
    }
  }
}