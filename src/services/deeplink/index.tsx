import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Config from 'react-native-config'; 
import appsFlyer from 'react-native-appsflyer';

export default class DeepLink {
  static STORAGE_KEYS = {
    REFERRAL_CODE: 'REFERRAL_CODE',
    HAS_PROCESSED_APP_OPEN_ATTRIBUTION: 'hasProcessedAppOpenAttribution',
  };

  static ATTRIBUTION_STATUS = {
    NON_ORGANIC: 'Non-organic',
    ORGANIC: 'Organic',
  };


  static async init() {
    try {
      if (!DeepLink.validateConfig()) {
        console.error('DeepLink Error - Initialization failed: Invalid configuration. Please check DEV_KEY and IOS_APP_ID in your .env file.');
        return;
      }
      const appsFlyerOptions = {
        devKey: Config.DEV_KEY,
        isDebug: DeepLink.parseBoolean(Config.IS_TEST_MODE),
        appId: Config.IOS_APP_ID,
        onInstallConversionDataListener: true,
        onDeepLinkListener: true,
        onAppOpenAttributionListener: true,
      };
      appsFlyer.initSdk(appsFlyerOptions);
      console.log('DeepLink: AppsFlyer SDK initialized.');
      DeepLink.setupDeepLinkListener();
      DeepLink.setupInstallConversionListener();
      await DeepLink.setupAppOpenAttributionListener();
      await DeepLink.handleInitialUrl();
      DeepLink.setupUrlListener();
    } catch (err) {
      console.error('DeepLink Error - Failed to initialize:', err);
    }
  }

  static validateConfig() {
    const requiredConfigs = ['DEV_KEY', 'IOS_APP_ID'];
    let isValid = true;
    requiredConfigs.forEach(key => {
      const value = Config[key];
      if (!value || typeof value !== 'string' || value.trim().length === 0) {
        console.warn(`DeepLink Config Warning: Missing or invalid value for Config.${key}. Current value: "${value}"`);
        isValid = false;
      }
    });
    return isValid;
  }

  static parseBoolean(value) {
    if (typeof value === 'boolean') {
      return value;
    }
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase().trim();
      if (lowerValue === 'true') return true;
      if (lowerValue === 'false') return false;
    }
    return Boolean(value);
  }

 
  static setupDeepLinkListener() {
    try {
      appsFlyer.onDeepLink(deepLinkResult => {
        console.log('DeepLink: AppsFlyer onDeepLink received:', deepLinkResult);
        if (!DeepLink.isValidDeepLinkResult(deepLinkResult)) {
          console.warn('DeepLink - Invalid deep link result received from AppsFlyer.');
          return;
        }
        const deepLinkData = deepLinkResult.data;
        const referralCode = DeepLink.extractReferralCodeFromData(deepLinkData, 'af_refcode');
        if (referralCode) {
          DeepLink.storeReferralCode(referralCode);
          console.log('DeepLink: Stored referral code from AppsFlyer deep link:', referralCode);
        }
      });
    } catch (err) {
      console.error('DeepLink Error - Failed to setup deep link listener:', err);
    }
  }

  static setupInstallConversionListener() {
    try {
      const onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
        (res) => {
          console.log('DeepLink: AppsFlyer onInstallConversionData received:', res);
          if (!DeepLink.isValidInstallConversionData(res)) {
            console.warn('DeepLink - Invalid install conversion data received from AppsFlyer.');
            return;
          }
          const isFirstLaunch = DeepLink.parseBoolean(res.data.is_first_launch);
          if (isFirstLaunch) {
            DeepLink.handleFirstLaunchAttribution(res.data);
          } else {
            console.log('DeepLink: This is not the first launch (AppsFlyer install conversion data).');
          }
        }
      );
    } catch (err) {
      console.error('DeepLink Error - Failed to setup install conversion listener:', err);
    }
  }

  static async setupAppOpenAttributionListener() {
    try {
      const hasProcessed = await AsyncStorage.getItem(DeepLink.STORAGE_KEYS.HAS_PROCESSED_APP_OPEN_ATTRIBUTION);
      if (hasProcessed !== 'true') {
        appsFlyer.onAppOpenAttribution(attributionData => {
          const openAttributionData = attributionData?.data || {};
          console.log('DeepLink: AppsFlyer app open attribution data:', openAttributionData);
          const referralCode = DeepLink.extractReferralCodeFromData(openAttributionData, 'af_refcode');
          if (referralCode && openAttributionData.af_referrer_customer_id) {
            DeepLink.storeReferralCode(referralCode);
            console.log('DeepLink: Stored referral code from app open attribution:', referralCode);
          }
          AsyncStorage.setItem(DeepLink.STORAGE_KEYS.HAS_PROCESSED_APP_OPEN_ATTRIBUTION, 'true')
            .catch(err => console.error('DeepLink Error - Failed to set hasProcessedAppOpenAttribution flag:', err));
        });
      } else {
        console.log('DeepLink: App open attribution already processed, skipping listener setup.');
      }
    } catch (err) {
      console.error('DeepLink Error - Failed to setup app open attribution listener:', err);
    }
  }

  static async handleInitialUrl() {
    try {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        console.log('DeepLink: Initial URL detected:', initialUrl);
        DeepLink.handleUrl(initialUrl);
      } else {
        console.log('DeepLink: No initial URL found.');
      }
    } catch (err) {
      console.error('DeepLink Error - Failed to handle initial URL:', err);
    }
  }

  static setupUrlListener() {
    try {
      Linking.addEventListener('url', ({ url }) => {
        console.log('DeepLink: URL event received:', url);
        DeepLink.handleUrl(url);
      });
    } catch (err) {
      console.error('DeepLink Error - Failed to setup URL listener:', err);
    }
  }

  static isValidDeepLinkResult(deepLinkResult) {
    return (
      deepLinkResult &&
      typeof deepLinkResult === 'object' &&
      deepLinkResult.status === 'success' && 
      deepLinkResult.data &&
      typeof deepLinkResult.data === 'object'
    );
  }

  static isValidInstallConversionData(res) {
    return (
      res &&
      typeof res === 'object' &&
      res.data &&
      typeof res.data === 'object'
    );
  }

  static extractReferralCodeFromData(data, key) {
    if (!data || typeof data !== 'object' || !key) {
      console.warn('DeepLink: Invalid data or key provided for referral code extraction.');
      return null;
    }

    const value = data[key];
    return (typeof value === 'string' && value.trim().length > 0) ? value.trim() : null;
  }

  static handleFirstLaunchAttribution(data) {
    try {
      const { af_status, media_source, campaign, af_referrer_customer_id } = data;

      if (af_status === DeepLink.ATTRIBUTION_STATUS.NON_ORGANIC) {
        const referralCode = DeepLink.extractReferralCodeFromData(data, 'af_refcode');

        // Store referral code if it's a non-organic install with a referrer customer ID
        if (af_referrer_customer_id && referralCode) {
          console.log('DeepLink: Non-organic install with referral code:', referralCode);
          DeepLink.storeReferralCode(referralCode);
        }

        const mediaSourceStr = typeof media_source === 'string' ? media_source : 'Unknown';
        const campaignStr = typeof campaign === 'string' ? campaign : 'Unknown';

        console.log(`DeepLink: First launch - Non-Organic install. Media source: ${mediaSourceStr}, Campaign: ${campaignStr}`);

      } else if (af_status === DeepLink.ATTRIBUTION_STATUS.ORGANIC) {
        console.log('DeepLink: First launch - Organic Install.');
      } else {
        console.log('DeepLink: First launch with unknown attribution status:', af_status);
      }
    } catch (err) {
      console.error('DeepLink Error - Failed to handle first launch attribution:', err);
    }
  }

  static handleUrl(url) {
    if (!url || typeof url !== 'string') {
      console.warn('DeepLink - Invalid URL received for handling:', url);
      return;
    }
    try {
      console.log('DeepLink - Attempting to handle URL:', url);
      const referralCode = DeepLink.extractReferralCode(url);
      if (referralCode) {
        DeepLink.storeReferralCode(referralCode);
        console.log('DeepLink: Stored referral code from URL:', referralCode);
      }
    } catch (err) {
      console.error('DeepLink Error - Failed to handle URL:', err, url);
    }
  }

  static extractReferralCode(url) {
    if (!url || typeof url !== 'string') {
      console.warn('DeepLink: Invalid URL provided for referral code extraction.');
      return null;
    }
    try {
      const match = url.match(/[?&]ref=([^&]+)/);
      if (match && match[1]) {
        const decoded = decodeURIComponent(match[1]);
        return decoded.trim().length > 0 ? decoded.trim() : null;
      }
      return null;
    } catch (err) {
      console.error('DeepLink Error - Failed to extract referral code from URL:', err);
      return null;
    }
  }

  static async storeReferralCode(code) {
    if (!code || typeof code !== 'string' || code.trim().length === 0) {
      console.warn('DeepLink - Invalid referral code provided for storage:', code);
      return false;
    }
    try {
      await AsyncStorage.setItem(DeepLink.STORAGE_KEYS.REFERRAL_CODE, code.trim());
      console.log('DeepLink: Referral code successfully stored.');
      return true;
    } catch (err) {
      console.error('DeepLink Error - Failed to store referral code:', err);
      return false;
    }
  }

  static async getReferralCode() {
    try {
      const code = await AsyncStorage.getItem(DeepLink.STORAGE_KEYS.REFERRAL_CODE);
      return (code && typeof code === 'string' && code.trim().length > 0) ? code.trim() : null;
    } catch (err) {
      console.error('DeepLink Error - Failed to retrieve referral code:', err);
      return null;
    }
  }

  static async clearReferralCode() {
    try {
      await AsyncStorage.removeItem(DeepLink.STORAGE_KEYS.REFERRAL_CODE);
      console.log('DeepLink: Referral code successfully cleared.');
      return true;
    } catch (err) {
      console.error('DeepLink Error - Failed to clear referral code:', err);
      return false;
    }
  }

  static async hasReferralCode() {
    const code = await DeepLink.getReferralCode();
    return code !== null;
  }

  static async clearAllData() {
    try {
      await Promise.all([
        AsyncStorage.removeItem(DeepLink.STORAGE_KEYS.REFERRAL_CODE),
        AsyncStorage.removeItem(DeepLink.STORAGE_KEYS.HAS_PROCESSED_APP_OPEN_ATTRIBUTION),
      ]);
      console.log('DeepLink: All deep link related data cleared from AsyncStorage.');
      return true;
    } catch (err) {
      console.error('DeepLink Error - Failed to clear all deep link data:', err);
      return false;
    }
  }
}
