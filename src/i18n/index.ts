import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import { resources } from './config';

const getDeviceLanguage = () => {
  try {
    const locales = RNLocalize.getLocales();
    if (locales && locales.length > 0) {
      return locales[0].languageCode;
    }
    const deviceLanguage =
      Platform.OS === 'ios'
        ? NativeModules.SettingsManager.settings.AppleLocale ||
          NativeModules.SettingsManager.settings.AppleLanguages[0]
        : NativeModules.I18nManager.localeIdentifier;
    return deviceLanguage.split('_')[0];
  } catch (error) {
    console.warn('Failed to get device language:', error);
    return 'en';
  }
};

const initI18n = async () => {
  let savedLanguage = 'en';
  try {
    const userLanguage = await AsyncStorage.getItem('userLanguage');
    if (userLanguage) {
      savedLanguage = userLanguage;
    } else {
      savedLanguage = getDeviceLanguage();
    }
  } catch (error) {
    console.warn('Failed to get saved language:', error);
    savedLanguage = getDeviceLanguage();
  }
  
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false
      },
      compatibilityJSON: 'v3',
    });
};

initI18n();

export default i18n;

