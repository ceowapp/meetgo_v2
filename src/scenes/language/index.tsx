import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  SafeAreaView, 
  StatusBar,
  Dimensions,
  Platform,
  ScrollView
} from 'react-native';
import Container from 'components/Container';
import useToast from 'components/Toast/useToast';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FLAGS, LANGUAGE_NAMES } from 'constant/languageConstant';
import CommonHeader from 'components/CommonHeader';
import Screen, {resFont, resWidth} from 'utils/Screen';
import LinearGradient from 'react-native-linear-gradient';
import { SupportedLanguage } from 'i18n/types';

const { width, height } = Dimensions.get('window');

const LanguageSetting = ({ navigation }) => {
  const { i18n, t } = useTranslation();
  const {top} = useSafeAreaInsets();
  const insets = useSafeAreaInsets();
  const changeLanguage = async (lng: SupportedLanguage) => {
    await i18n.changeLanguage(lng);
    await AsyncStorage.setItem('userLanguage', lng);
    /*if (Platform.OS === 'ios') {
      const Haptics = require('react-native-haptic-feedback').default;
      Haptics.trigger('impactMedium');
    } else {
      const ReactNativeHapticFeedback = require('react-native-haptic-feedback').default;
      ReactNativeHapticFeedback.trigger('impactMedium');
    }*/
    setTimeout(() => {
      navigation.goBack();
    }, 500);
  };

  const headerInfo = (
    <CommonHeader
      title={t('account.language')}
      containerStyle={[
        styles.header,
        {
          height: top + resWidth(44),
        },
      ]}
    />
  );

  const renderLanguageOption = (code: SupportedLanguage) => {
    const isActive = i18n.language === code;
    return (
      <TouchableOpacity
        key={code}
        style={[
          styles.languageOption,
          isActive && styles.activeOption,
        ]}
        onPress={() => changeLanguage(code)}
        activeOpacity={0.7}
      >
        {/**<View style={styles.flagContainer}>
          <Image
            source={FLAGS[code]}
            style={styles.flagImage}
          />
        </View>**/}
        <View style={styles.languageTextContainer}>
          <Text style={[
            styles.languageName,
            isActive && styles.activeText
          ]}>
            {LANGUAGE_NAMES[code].native}
          </Text>
          {code !== i18n.language && (
            <Text style={styles.languageLocalName}>
              {LANGUAGE_NAMES[code].local}
            </Text>
          )}
        </View>
        {isActive && (
          <View style={styles.checkmarkContainer}>
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
     <LinearGradient {...Screen.linearBackground} style={{flex: 1}}>
      {headerInfo}
      <Container edges={['bottom']}>
        <SafeAreaView style={[
          styles.safeArea,
          { paddingTop: insets.top }
        ]}>
          <ScrollView 
            style={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <Text style={styles.title}>{t('account.selectLanguage')}</Text>
              <Text style={styles.subtitle}>{t('account.languageDescription')}</Text>
              <View style={styles.optionsContainer}>
                {Object.keys(LANGUAGE_NAMES).map(code => renderLanguageOption(code))}
              </View>
              <Text style={styles.supportText}>
                {t('account.moreLangComing')}
              </Text>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Container>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  placeholderView: {
    width: 40,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 30,
    lineHeight: 22,
  },
  optionsContainer: {
    marginBottom: 30,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  languageTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  languageName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  activeText: {
    color: '#FFFFFF',
  },
  languageLocalName: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.65)',
    marginTop: 4,
  },
  checkmarkContainer: {
    width: 24,
    height: 24,
    marginLeft: 12,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#4E0E9C',
    fontSize: 14,
    fontWeight: 'bold',
  },
  supportText: {
    textAlign: 'center',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
});

export default LanguageSetting;