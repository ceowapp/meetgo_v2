import React, {ReactElement, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CarouselDot from 'components/CarouselDot';
import Container from 'components/Container';
import Navbar from 'components/Navbar';
import { useSharedValue } from 'react-native-reanimated';
import {SPACING} from 'utils/styleGuide';
import styles from './styles';
import Images from 'utils/Images';
import {Text} from 'react-native-paper';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import useAuth from 'scenes/auth/helper/useAuth';
import Platform from 'utils/Platform';
import FastImage from 'react-native-fast-image';
import Screen, {perWidth} from 'utils/Screen';
import { useTranslation } from 'react-i18next';

GoogleSignin.configure();

const widthContainerDot = perWidth(100);
const Intro = (): ReactElement => {
  const { t } = useTranslation();
  const index = useSharedValue(0);
  const {onSignInApple, onSignInGoogle, onSiginAndroidApple, loading} =
    useAuth();
  const scrollHandler = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset.x;
    const nextIndex = Math.round(contentOffset / widthContainerDot);
    index.value = nextIndex;
  };
  const INTRO = [
    {
      content: t('login.intro1Content'),
      image: Images.intro.intro1,
      key: 'intro1',
    },
    {
      content: t('login.intro2Content'),
      image: Images.intro.intro2,
      key: 'intro2',
    },
    {
      content: t('login.intro3Content'),
      image: Images.intro.intro3,
      key: 'intro3',
    },
  ];

  return (
    <LinearGradient
      {...Screen.linearBackground}
      style={{
        flex: 1,
      }}>
      <Navbar />
      <Container style={styles.container}>
        <View style={styles.viewSlide}>
          <ScrollView
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={false}
            onScroll={scrollHandler}
            scrollEventThrottle={16}>
            {INTRO.map(({key, image, content}) => {
              return (
                <View key={key} style={styles.slideContainer}>
                  <Image
                    source={image}
                    style={styles.sliderImage}
                    resizeMode="contain"
                  />
                  <Text
                    variant="headlineSmall"
                    // @ts-ignore
                    style={styles.description}>
                    {content}
                  </Text>
                </View>
              );
            })}
          </ScrollView>
          <CarouselDot total={INTRO.length} index={index} />
        </View>
        <View style={styles.bottomContainer}>
          <Text variant="titleMedium" style={styles.txtLogin}>
            {t('login.signInWith')}
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              style={styles.socialSize}
              disabled={loading}
              onPress={onSignInGoogle}>
              <FastImage
                source={Images.icon.logoGoogle}
                resizeMode="contain"
                style={{
                  aspectRatio: 1,
                  opacity: loading ? 0.5 : 1,
                }}
              />
            </TouchableOpacity>
            <View style={{width: SPACING.l_48}} />
            <TouchableOpacity
              style={styles.socialSize}
              disabled={loading}
              onPress={Platform.isIos ? onSignInApple : onSiginAndroidApple}>
              <FastImage
                source={Images.icon.logoApple}
                resizeMode="contain"
                style={{
                  aspectRatio: 1,
                  opacity: loading ? 0.5 : 1,
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Container>
    </LinearGradient>
  );
};

export default Intro;
