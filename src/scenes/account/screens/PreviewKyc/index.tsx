import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import CommonHeader from 'components/CommonHeader';
import Container from 'components/Container';
import LineBreak from 'components/LineBreak';
import {AppStackParamList, STACK_NAVIGATOR} from 'navigation/types';
import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import Carousel from 'react-native-reanimated-carousel';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Screen, {perWidth, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import {shadow} from 'utils/mixins';
import {ButtonPrimary} from 'components/Button/Primary';
import LinearGradient from 'react-native-linear-gradient';
import {ProgressiveImage} from 'components/Image/ProgressiveImage';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    paddingBottom: SPACING.m_16,
  },
});

const PreviewKyc = () => {
  const { t } = useTranslation();
  const {params} = useRoute<RouteProp<AppStackParamList, 'VERIFY_ACCOUNT'>>();
  const navigation = useNavigation();
  const {infoKyc} = params || {};
  const {bottom, top} = useSafeAreaInsets();
  const listImgKyc = [
    {
      img: infoKyc.storeUrlFrontID,
      content: t('account.IDPictureFront'),
    },
    {
      img: infoKyc.storeUrlBackID,
      content: t('account.IDPictureBehind'),
    },
    {
      img: infoKyc.storeUrlKycWithID,
      content: t('account.profilePicture'),
    },
  ];
  const navigateToUpdateKYC = () => {
    //@ts-ignore
    navigation.navigate(STACK_NAVIGATOR.VERIFY_ACCOUNT, {infoKyc});
  };
  return (
    <LinearGradient {...Screen.linearBackground} style={{flex: 1}}>
      <Container edges={['bottom']}>
        <CommonHeader
          title={t('account.authenInfo')}
          titleStyle={{color: COLORS.white}}
          containerStyle={[
            styles.header,
            {
              height: top + resWidth(44),
            },
          ]}
        />
        <ScrollView
          style={{flex: 1}}
          contentContainerStyle={{
            paddingBottom: bottom,
          }}>
          <View
            style={{
              paddingHorizontal: SPACING.l_24,
              paddingVertical: SPACING.m_16,
            }}>
            <Text
              variant="headlineSmall"
              style={{
                textDecorationLine: 'underline',
              }}>
              {t('account.idInfo')}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: SPACING.m_16,
              }}>
              <Text>{t('account.fullName')} </Text>
              <Text style={{fontWeight: 'bold'}}>{infoKyc?.fullname}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: SPACING.m_16,
              }}>
              <Text>{t('account.birthday')} </Text>
              <Text style={{fontWeight: 'bold'}}>{infoKyc?.birthday}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: SPACING.m_16,
              }}>
              <Text>{t('account.identification')} </Text>
              <Text style={{fontWeight: 'bold'}}>{infoKyc?.idnumber}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: SPACING.m_16,
              }}>
              <Text>{t('account.idday')} </Text>
              <Text style={{fontWeight: 'bold'}}>{infoKyc?.idday}</Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingTop: SPACING.m_16,
              }}>
              <Text>{t('account.idplace')} </Text>
              <Text style={{fontWeight: 'bold'}}>{infoKyc?.idnumber}</Text>
            </View>
          </View>
          <LineBreak />

          <Text
            variant="headlineSmall"
            style={{
              textDecorationLine: 'underline',
              padding: SPACING.m_16,
            }}>
            {t('account.idpicture')}
          </Text>
          <Carousel
            width={perWidth(100)}
            height={resWidth(220)}
            data={listImgKyc}
            mode="parallax"
            scrollAnimationDuration={1000}
            renderItem={({item}) => (
              <View style={{alignItems: 'center'}}>
                <ProgressiveImage
                  source={{uri: item.img}}
                  style={{
                    width: '100%',
                    height: resWidth(200),
                    borderRadius: 10,
                  }}
                  resizeMode="cover"
                />
                <Text
                  variant="titleLarge"
                  style={{paddingVertical: SPACING.s_8}}>
                  {item.content}
                </Text>
              </View>
            )}
          />
        </ScrollView>
        <View
          style={{
            paddingHorizontal: SPACING.l_24,
            ...shadow('medium'),
          }}>
          <ButtonPrimary
            content={t('account.IDUpdate')}
            onPress={navigateToUpdateKYC}
          />
        </View>
      </Container>
    </LinearGradient>
  );
};
export default PreviewKyc;
