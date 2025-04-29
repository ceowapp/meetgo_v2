import Container from 'components/Container';
import React from 'react';
import {
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Carousel from 'react-native-reanimated-carousel';
import {Text} from 'react-native-paper';
import {shadow} from 'utils/mixins';
import Screen, {perHeight, perWidth, resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import Header from './Header';
import MainPanel from './MainPanel';
import QuickInfo from './QuickInfo';
import Images from 'utils/Images';
import {navigateScreen} from 'navigation/RootNavigation';
import {STACK_NAVIGATOR} from 'navigation/types';
import {getSoftMenuBarHeight} from 'react-native-extra-dimensions-android';
import Platform from 'utils/Platform';
import MeetGuide from './MeetGuide';
import HandlerModal from './HandlerModal';
import { useTranslation } from 'react-i18next';
const bgFake = [
  {
    key: 1,
  },
  {
    key: 2,
  },
  {
    key: 3,
  },
  {
    key: 4,
  },
  {
    key: 5,
  },
  {
    key: 6,
  },
];
const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: SPACING.l_24 + resWidth(95),
  },
  panelContainer: {
    backgroundColor: COLORS.transparent,
  },
  p16: {
    paddingHorizontal: SPACING.m_16,
  },
  bannerImg: {
    width: '95%',
    height: '100%',
    borderRadius: 10,
  },
  discover: {
    paddingHorizontal: SPACING.m_16,
    paddingVertical: SPACING.s_12,
    fontFamily: 'Roboto-bold',
    fontWeight: '700',
    fontSize: resFont(14),
    lineHeight: resWidth(16),
    color: COLORS.white,
  },
  discoverImg: {
    width: perWidth(100) - SPACING.m_16 * 2,
    height: resWidth(140),
    alignSelf: 'center',
    overflow: 'hidden',
    borderRadius: SPACING.s_12,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: COLORS.backgroundBlack30,
    shadowRadius: 1,
    elevation: 4,
  },
  mapImg: {
    width: '100%',
    height: '100%',
  },
  fakeBottom: {
    paddingTop: SPACING.m_16,
    height: '100%',
    marginTop: -1,
  },
});

const HomeScreens = () => {
  const { t } = useTranslation();
  const openHowToUseApp = () => {
    Linking.openURL('https://meetgo.vn/huong-dan-su-dung');
  };
  return (
    <LinearGradient {...Screen.linearBackground} style={{flex: 1}}>
      <Container edges={['top']}>
        <HandlerModal />
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}>
          <View style={styles.p16}>
            <Header />
            <QuickInfo />
          </View>
          <MainPanel />
          <View style={styles.panelContainer}>
            <Text style={styles.discover}>{t('home.location_explorer')}</Text>
            <TouchableOpacity
              onPress={() => navigateScreen(STACK_NAVIGATOR.LOCATION_MAP)}
              style={styles.discoverImg}>
              <Image
                source={Images.global.mapBg}
                style={styles.mapImg}
                resizeMode="cover"
              />
            </TouchableOpacity>
            <Text style={styles.discover}>{t('home.guide_title')}</Text>
            <Carousel
              width={perWidth(100)}
              height={resWidth(180)}
              data={bgFake}
              loop={false}
              // mode="parallax"
              scrollAnimationDuration={1000}
              renderItem={({item}) => (
                <MeetGuide step={item.key} onClick={openHowToUseApp} />
              )}
            />
          </View>
        </ScrollView>
      </Container>
    </LinearGradient>
  );
};
export default HomeScreens;
