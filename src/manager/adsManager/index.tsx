import { AppState, Platform } from 'react-native';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import mobileAds, { MaxAdContentRating } from 'react-native-google-mobile-ads';
import Config from 'react-native-config';

class AdsManager {
  static instance = null;
  
  static AD_TYPES = {
    BANNER: 'BANNER',
    INTERSTITIAL: 'INTERSTITIAL'
  };

  static TEST_IDS = {
    [AdsManager.AD_TYPES.BANNER]: 'ca-app-pub-3940256099942544/6300978111',
    [AdsManager.AD_TYPES.INTERSTITIAL]: 'ca-app-pub-3940256099942544/1033173712'
  };

  static PRODUCTION_IDS = {
    ios: {
      [AdsManager.AD_TYPES.BANNER]: Config.ADMOB_BANNER_ID_IOS || '',
      [AdsManager.AD_TYPES.INTERSTITIAL]: Config.ADMOB_INTERSTITIAL_ID_IOS || ''
    },
    android: {
      [AdsManager.AD_TYPES.BANNER]: Config.ADMOB_BANNER_ID_ANDROID || '',
      [AdsManager.AD_TYPES.INTERSTITIAL]: Config.ADMOB_INTERSTITIAL_ID_ANDROID || ''    
    }
  };

  static PERMISSION_STATUS = {
    GRANTED: RESULTS.GRANTED,
    DENIED: RESULTS.DENIED,
    BLOCKED: RESULTS.BLOCKED,
    UNAVAILABLE: RESULTS.UNAVAILABLE,
    LIMITED: RESULTS.LIMITED,
  };

  constructor() {
    if (AdsManager.instance) {
      return AdsManager.instance;
    }
    AdsManager.instance = this;
    this.initialized = false;
    this.initializationPromise = null;
    this.testMode = this.determineTestMode();
    this.appStateSubscription = null;
    this.currentPlatform = Platform.OS;
    
    this.setupAppStateListener();
  }

  determineTestMode() {
    try {
      const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : false;
      const isTestConfig = this.parseBoolean(Config.IS_TEST_MODE);
      return isDev || isTestConfig;
    } catch (error) {
      console.warn('AdsManager - Error determining test mode, defaulting to false:', error);
      return false;
    }
  }

  parseBoolean(value) {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const lowerValue = value.toLowerCase().trim();
      return lowerValue === 'true';
    }
    return Boolean(value);
  }

  setupAppStateListener() {
    try {
      this.appStateSubscription = AppState.addEventListener(
        'change',
        this.handleAppStateChange.bind(this)
      );
    } catch (error) {
      console.error('AdsManager - Failed to setup app state listener:', error);
    }
  }

  handleAppStateChange(nextAppState) {
    if (nextAppState === 'active' && !this.initialized) {
      console.log('AdsManager - App became active, attempting initialization');
      this.initialize().catch(error => {
        console.error('AdsManager - Failed to initialize on app state change:', error);
      });
    }
  }

  async checkTrackingPermission() {
    if (Platform.OS !== 'ios') {
      console.log('AdsManager - Tracking permission check skipped (not iOS)');
      return { status: 'not_applicable', platform: Platform.OS };
    }
    try {
      const result = await check(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
      console.log('AdsManager - Current tracking permission status:', result);
      if (result === AdsManager.PERMISSION_STATUS.DENIED) {
        console.log('AdsManager - Requesting tracking permission');
        const requestResult = await request(PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY);
        console.log('AdsManager - Tracking permission request result:', requestResult);
        return { status: requestResult, requested: true };
      }
      return { status: result, requested: false };
    } catch (error) {
      console.error('AdsManager - Error checking tracking permission:', error);
      return { status: 'error', error: error.message };
    }
  }

  validateConfiguration() {
    const errors = [];
    if (this.testMode) {
      console.log('AdsManager - Running in test mode, skipping production config validation');
      return { isValid: true, errors: [] };
    }

    const platformIds = AdsManager.PRODUCTION_IDS[this.currentPlatform];
    if (!platformIds) {
      errors.push(`No ad unit IDs configured for platform: ${this.currentPlatform}`);
      return { isValid: false, errors };
    }

    Object.values(AdsManager.AD_TYPES).forEach(adType => {
      const adUnitId = platformIds[adType];
      if (!adUnitId || typeof adUnitId !== 'string' || adUnitId.trim().length === 0) {
        errors.push(`Missing or invalid ${adType} ad unit ID for ${this.currentPlatform}`);
      } else if (!adUnitId.startsWith('ca-app-pub-')) {
        errors.push(`Invalid ${adType} ad unit ID format for ${this.currentPlatform}: ${adUnitId}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  getAdUnitId(adType) {
    if (!Object.values(AdsManager.AD_TYPES).includes(adType)) {
      console.error('AdsManager - Invalid ad type:', adType);
      return null;
    }

    if (this.testMode) {
      console.log(`AdsManager - Using test ad unit ID for ${adType}`);
      return AdsManager.TEST_IDS[adType];
    }

    const platformIds = AdsManager.PRODUCTION_IDS[this.currentPlatform];
    if (!platformIds) {
      console.warn(`AdsManager - No production ad unit IDs found for platform: ${this.currentPlatform}, falling back to test IDs`);
      return AdsManager.TEST_IDS[adType];
    }

    const adUnitId = platformIds[adType];
    if (!adUnitId) {
      console.warn(`AdsManager - No ad unit ID found for type: ${adType} on ${this.currentPlatform}, falling back to test ID`);
      return AdsManager.TEST_IDS[adType];
    }

    console.log(`AdsManager - Using production ad unit ID for ${adType} on ${this.currentPlatform}`);
    return adUnitId;
  }

  async initialize() {
    if (this.initializationPromise) {
      return this.initializationPromise;
    }
    if (this.initialized) {
      console.log('AdsManager - Already initialized');
      return { success: true, message: 'Already initialized' };
    }
    this.initializationPromise = this.performInitialization();
    return this.initializationPromise;
  }

  async performInitialization() {
    try {
      console.log(`AdsManager - Starting initialization for platform: ${this.currentPlatform}...`);
      console.log(`AdsManager - Test mode: ${this.testMode}`);
      const configValidation = this.validateConfiguration();
      if (!configValidation.isValid) {
        throw new Error(`Configuration validation failed: ${configValidation.errors.join(', ')}`);
      }
      //const permissionResult = await this.checkTrackingPermission();
      //console.log('AdsManager - Permission check result:', permissionResult);
      const adapterStatuses = await mobileAds().initialize();
      console.log('AdsManager - Mobile ads initialized, adapter statuses:', adapterStatuses);
      const requestConfig = {
        maxAdContentRating: MaxAdContentRating.PG,
        tagForChildDirectedTreatment: false,
        tagForUnderAgeOfConsent: false,
      };
      await mobileAds().setRequestConfiguration(requestConfig);
      console.log('AdsManager - Request configuration set');
      this.initialized = true;
      this.initializationPromise = null;
      const result = {
        success: true,
        adapterStatuses,
        //permissionResult,
        testMode: this.testMode,
        platform: this.currentPlatform,
        timestamp: new Date().toISOString(),
      };
      console.log('AdsManager - Initialization completed successfully:', result);
      return result;
    } catch (error) {
      console.error('AdsManager - Initialization failed:', error);
      this.initializationPromise = null;
      const errorResult = {
        success: false,
        error: error.message,
        testMode: this.testMode,
        platform: this.currentPlatform,
        timestamp: new Date().toISOString(),
      };
      throw errorResult;
    }
  }

  handleAdLoadError(error, adType) {
    console.log(`AdsManager - ${adType} ad load error:`, error);
    if (error.code === 'googleMobileAds/error-code-no-fill') {
      console.log(`AdsManager - No fill for ${adType} ad. This is normal and not an error.`);
      return { isNoFill: true, shouldRetry: false };
    }
    if (error.code === 'googleMobileAds/error-code-network-error') {
      console.log(`AdsManager - Network error for ${adType} ad. Should retry later.`);
      return { isNoFill: false, shouldRetry: true };
    }
    if (error.code === 'googleMobileAds/error-code-invalid-request') {
      console.error(`AdsManager - Invalid request for ${adType} ad. Check configuration.`);
      return { isNoFill: false, shouldRetry: false };
    }
    console.warn(`AdsManager - Unknown error for ${adType} ad:`, error.code);
    return { isNoFill: false, shouldRetry: true };
  }

  getBannerAdUnitId() {
    return this.getAdUnitId(AdsManager.AD_TYPES.BANNER);
  }

  getInterstitialAdUnitId() {
    return this.getAdUnitId(AdsManager.AD_TYPES.INTERSTITIAL);
  }

  isInitialized() {
    return this.initialized;
  }

  isTestMode() {
    return this.testMode;
  }

  getCurrentPlatform() {
    return this.currentPlatform;
  }

  getAllAdUnitIds() {
    return {
      banner: this.getBannerAdUnitId(),
      interstitial: this.getInterstitialAdUnitId()
    };
  }

  validateAdUnitIds() {
    const ids = this.getAllAdUnitIds();
    const isValid = Object.values(ids).every(id => id && id.length > 0);
    if (!isValid) {
      console.warn('AdsManager - Some ad unit IDs are missing or invalid:', ids);
    }
    return isValid;
  }

  setTestMode(enabled) {
    this.testMode = enabled;
    console.log('AdsManager - Test mode set to:', enabled);
  }

  async reinitialize() {
    console.log('AdsManager - Reinitializing...');
    this.initialized = false;
    this.initializationPromise = null;
    return this.initialize();
  }

  getStatus() {
    return {
      initialized: this.initialized,
      testMode: this.testMode,
      platform: this.currentPlatform,
      hasValidConfig: this.validateConfiguration().isValid,
      adUnitIds: this.getAllAdUnitIds(),
    };
  }

  destroy() {
    try {
      if (this.appStateSubscription) {
        this.appStateSubscription.remove();
        this.appStateSubscription = null;
      }
      this.initialized = false;
      this.initializationPromise = null;
      console.log('AdsManager - Cleanup completed');
    } catch (error) {
      console.error('AdsManager - Error during cleanup:', error);
    }
  }

  static getInstance() {
    if (!AdsManager.instance) {
      new AdsManager();
    }
    return AdsManager.instance;
  }
}

export default new AdsManager();


