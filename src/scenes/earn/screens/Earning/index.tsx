import React, {useEffect, useRef} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {AppStackParamList} from 'navigation/types';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-paper';
import Screen, {resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import BtnStartEarn from './BtnStartEarn';
import FastImage from 'react-native-fast-image';
import Images from 'utils/Images';
import Container from 'components/Container';
import CommonHeader from 'components/CommonHeader';
import useEarn from 'scenes/earn/helper/useEarn';
import {IReqCurrentEarn} from 'scenes/earn/redux/types';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';
import {hideModal, showDialogModal} from 'services/globalModal/modalHandler';
import WarningDialog from 'scenes/meets/screens/MeetTogether/WarningDialog';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'flex-end',
    paddingBottom: SPACING.m_16,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: resWidth(40),
    flex: 1,
  },
  address: {
    paddingTop: resWidth(36),
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(12),
    lineHeight: resWidth(16),
    color: COLORS.white,
    textAlign: 'center',
  },
  owner: {
    fontFamily: 'Roboto-bold',
    fontWeight: '700',
    fontSize: resFont(14),
    lineHeight: resWidth(16),
    color: COLORS.white,
    paddingTop: SPACING.s_8,
  },
  imgContainer: {
    paddingTop: SPACING.l_24,
    flex: 1,
  },
  imgShop: {
    width: resWidth(224),
    aspectRatio: 1,
  },
  img: {
    width: resWidth(224),
    height: resWidth(180),
  },
  txtHeader: {
    color: COLORS.white,
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: resFont(14),
    lineHeight: resWidth(16),
  },
});
const EarningScreen = () => {
  useKeepAwake();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const {top} = useSafeAreaInsets();
  const {params} = useRoute<RouteProp<AppStackParamList, 'EARN'>>();
  const {cancelEarn} = useEarn();
  const refEarn = useRef<IReqCurrentEarn & {makeDone: boolean}>();
  const isConfirmBackRef = useRef(false);
  const onSetDataEarn = (data: IReqCurrentEarn & {makeDone: boolean}) => {
    refEarn.current = data;
  };
  const onPressBack = () => {
    if (
      refEarn.current?.earnID &&
      !refEarn.current.makeDone &&
      isConfirmBackRef.current
    ) {
      cancelEarn(refEarn.current);
    }
    navigation.goBack();
  };

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      if (
        !isConfirmBackRef.current &&
        refEarn.current?.earnID &&
        !refEarn.current.makeDone
      ) {
        onWarningBack();
        e.preventDefault();
      } else {
        navigation.dispatch(e.data.action);
        hideModal();
      }
    });
  }, []);

  const onWarningBack = () => {
    const title = t('earn.warningTitle');
    const description = t('earn.warningDescription');
    showDialogModal({
      content: () => (
        <WarningDialog
          onContinue={hideModal}
          onExit={onFinishBack}
          title={title}
          description={description}
          source={Images.earn.earnExit}
        />
      ),
    });
  };

  const onFinishBack = () => {
    isConfirmBackRef.current = true;
    onPressBack();
  };
  return (
    <LinearGradient {...Screen.linearBackground} style={styles.container}>
      <Container edges={['bottom']}>
        <CommonHeader
          title="Earning"
          titleStyle={styles.txtHeader}
          onPressBtnDefaultLeft={onPressBack}
          containerStyle={[
            styles.header,
            {
              height: top + resWidth(44),
            },
          ]}
        />
        <View style={styles.contentContainer}>
          <View style={{alignItems: 'center'}}>
            <Text style={styles.address}>{params.address}</Text>
            <Text style={styles.owner}>{params.owner}</Text>
          </View>
          <View style={styles.imgContainer}>
            <FastImage
              source={{uri: params.imageShopLocation}}
              resizeMode="contain"
              style={styles.img}
            />
          </View>
          <View
            style={{
              flex: 1.5,
              alignItems: 'center',
            }}>
            <BtnStartEarn
              locationID={params.locationID}
              onSetDataEarn={onSetDataEarn}
              propsEarn={params.dataEarn}
            />
          </View>
        </View>
      </Container>
    </LinearGradient>
  );
};
export default EarningScreen;
