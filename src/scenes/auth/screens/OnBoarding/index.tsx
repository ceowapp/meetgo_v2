import Container from 'components/Container';
import React, {useState, useTransition} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button, Card, HelperText, Text, TextInput} from 'react-native-paper';
import useAccount from 'scenes/account/helper/useAccount';
import {AccountSelector} from 'scenes/account/redux/slice';
import {IFormOnboarding} from 'scenes/account/redux/types';
import {AuthActions, AuthSelector} from 'scenes/auth/redux/slice';
import {useAppDispatch, useAppSelector} from 'storeConfig/hook';
import {shadow} from 'utils/mixins';
import Screen, {perHeight, perWidth, resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import {validateEmail} from 'utils/Utility';
import Navbar from 'components/Navbar';
import { useTranslation } from 'react-i18next';

const style = StyleSheet.create({
  input: {
    borderTopLeftRadius: resWidth(10),
    borderTopRightRadius: resWidth(10),
    borderRadius: resWidth(10),
    shadowOpacity: 0.3,
    backgroundColor: COLORS.backgroundWhite10,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    // shadowColor: COLORS.backgroundWhite10,
    shadowRadius: 3,
  },
  spacing: {width: SPACING.m_16, aspectRatio: 1},
  refCode: {
    backgroundColor: COLORS.lightBlue,
    marginTop: SPACING.s_12,
    marginBottom: SPACING.m_16,
    borderTopLeftRadius: SPACING.s_8,
    borderTopRightRadius: SPACING.s_8,
    borderRadius: SPACING.s_8,
  },
  content: {
    padding: SPACING.m_16,
  },
  header: {
    fontFamily: 'Roboto-bold',
    fontWeight: '700',
    fontSize: resFont(14),
    lineHeight: resWidth(16),
    color: COLORS.primaryWhite,
    paddingBottom: SPACING.m_16,
    textAlign: 'center',
  },
  headerContainer: {
    backgroundColor: COLORS.backgroundWhite10,
    height: resWidth(85),
    justifyContent: 'flex-end',
    ...shadow(),
  },
  description: {
    fontFamily: 'Roboto-Regular',
    fontWeight: '400',
    fontSize: resFont(14),
    lineHeight: resWidth(16),
    color: COLORS.white,
  },
  cardContainer: {
    backgroundColor: COLORS.backgroundWhite10,
    ...shadow(),
    // shadowOpacity: 1,
    // shadowOffset: {
    //   width: 0,
    //   height: 10,
    // },
    // shadowColor: COLORS.backgroundBlack10,
    // shadowRadius: 10,
    marginTop: resWidth(28),
    paddingHorizontal: resWidth(22),
    paddingVertical: resWidth(40),
  },
  error: {
    fontSize: resFont(10),
    color: COLORS.red,
    paddingVertical: 0,
  },
  emailContain: {
    paddingVertical: resWidth(22),
  },
  refContain: {
    paddingBottom: resWidth(22),
  },
  btnContainer: {
    borderRadius: resWidth(10),
    borderWidth: 1,
    borderColor: 'white',
    width: resWidth(234),
    height: resWidth(54),
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: '#3525A2',
  },
  txtUpdate: {
    fontFamily: 'Roboto-Regular',
    color: 'white',
    fontSize: resFont(14),
    lineHeight: resWidth(16),
  },
  flex1: {
    flex: 1,
  },
  btnDisable: {
    backgroundColor: COLORS.grey3,
  },
});

const OnboardingScreen = () => {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();
  const dispatch = useAppDispatch();
  const getFirstName = useAppSelector(AccountSelector.getFirstName);
  const getLastName = useAppSelector(AccountSelector.getLastName);
  const getEmail = useAppSelector(AccountSelector.getEmail);
  const [referral, setReferral] = useState('');
  const idAuth = useAppSelector(AccountSelector.getIdAuth);
  const account = useAppSelector(AuthSelector.getAccount);
  const {loading, updateFirstSignup} = useAccount();

  const onboardSuccess = () => {
    dispatch(AuthActions.setRegisterSuccess());
  };
  
  const onPressLater = () => {
    if (idAuth) {
      const dataPayload: IFormOnboarding = {
        idAuth,
        account,
        firstname: getFirstName || '',
        lastname: getLastName || '',
        email: getEmail || '',
        referral,
      };
      startTransition(() => {
        updateFirstSignup(dataPayload, onboardSuccess);
      });
    }
  };
  
  const headerInfo = (
    <View style={style.headerContainer}>
      <Text variant="headlineMedium" style={style.header}>
        {t('onBoarding.title')}
      </Text>
    </View>
  );

  const contentInfo = (
    <Card mode="elevated" style={style.cardContainer}>
      <View style={style.refContain}>
        <TextInput
          mode="flat"
          label={t('onBoarding.referralLabel')}
          placeholder={t('onBoarding.referralPlaceholder')}
          onChangeText={setReferral}
          activeUnderlineColor={COLORS.white}
          outlineColor={COLORS.white}
          activeOutlineColor={COLORS.white}
          underlineStyle={{
            height: 0,
          }}
          textColor="white"
          style={style.input}
          keyboardType="numeric"
        />
        <HelperText
          type="info"
          style={{
            fontSize: resFont(12),
            color: 'white',
          }}>
          {t('onBoarding.referralHelper')}
        </HelperText>
      </View>
      <Button
        mode="contained"
        onPress={onPressLater}
        loading={loading || isPending}
        disabled={loading || isPending}
        style={[style.btnContainer, (loading || isPending) ? style.btnDisable : undefined]}>
        <Text style={style.txtUpdate}>{t('onBoarding.update')}</Text>
      </Button>
    </Card>
  );
  return (
    <LinearGradient {...Screen.linearBackground} style={style.flex1}>
      <Navbar />
      <Container edges={['bottom']}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {headerInfo}
          <View style={style.content}>
            <Text variant="titleMedium" style={style.description}>
              {t('onBoarding.welcomeMessage')}
            </Text>
            {contentInfo}
          </View>
        </ScrollView>
      </Container>
    </LinearGradient>
  );
};
export default OnboardingScreen;
