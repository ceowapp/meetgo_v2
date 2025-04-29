import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { NativeModules, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import en from './translations/en';
import es from './translations/es';
import vi from './translations/vi';
import fr from './translations/fr';
import de from './translations/de';
import it from './translations/it';
import ru from './translations/ru';
import ja from './translations/ja';
import ko from './translations/ko';
import zhCN from './translations/zh-CN';
import zhTW from './translations/zh-TW';
import pt from './translations/pt';
import tr from './translations/tr';
import hi from './translations/hi';
import id from './translations/id';
import th from './translations/th';
import pl from './translations/pl';
import nl from './translations/nl';
import sv from './translations/sv';
import el from './translations/el';
import ar from './translations/ar';
import he from './translations/he';

const resources = {
  en: { translation: en },
  es: { translation: es },
  vi: { translation: vi },
  fr: { translation: fr },
  de: { translation: de },
  it: { translation: it },
  ru: { translation: ru },
  ja: { translation: ja },
  ko: { translation: ko },
  zh: { translation: zhCN },
  'zh-CN': { translation: zhCN },
  'zh-TW': { translation: zhTW },
  pt: { translation: pt },
  tr: { translation: tr },
  hi: { translation: hi },
  id: { translation: id },
  th: { translation: th },
  pl: { translation: pl },
  nl: { translation: nl },
  sv: { translation: sv },
  el: { translation: el },
  ar: { translation: ar },
  he: { translation: he },
};

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

