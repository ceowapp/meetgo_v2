import 'i18next';

export type SupportedLanguage =
  | 'en' | 'es' | 'vi' | 'fr' | 'de' | 'it' | 'ru' | 'ja' | 'ko'
  | 'zh' | 'zh-CN' | 'zh-TW' | 'pt' | 'tr' | 'hi' | 'id' | 'th'
  | 'pl' | 'nl' | 'sv' | 'el' | 'ar' | 'he';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: typeof import('./locales/en').default;
    };
  }
}
