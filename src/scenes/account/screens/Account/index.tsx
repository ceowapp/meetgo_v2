import {useFocusEffect, useNavigation} from '@react-navigation/native';
import Container from 'components/Container';
import {STACK_NAVIGATOR} from 'navigation/types';
import React, {FC, useCallback} from 'react';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import useAccount from 'scenes/account/helper/useAccount';
import useAccountKyc from 'scenes/account/helper/useAccountKyc';
import {AccountSelector} from 'scenes/account/redux/slice';
import {useAppSelector} from 'storeConfig/hook';
import Platform from 'utils/Platform';
import Screen, {resFont, resWidth} from 'utils/Screen';
import {SPACING, COLORS} from 'utils/styleGuide';
import AccountHeader from './Header';
import styles from './styles';
import {shadow} from 'utils/mixins';
import {ProgressiveImage} from 'components/Image/ProgressiveImage';
import {Source} from 'react-native-fast-image';
import Images from 'utils/Images';
import { useAccountMenu } from './constants';
import { useTranslation } from 'react-i18next';

interface Props {
  icon: Source;
  label: string;
  onPress: () => void;
  hasRightIcon?: boolean;
  type?: 'NONE' | 'PENDING' | 'REJECT' | 'DONE';
  isShowHint?: boolean;
  messageVerify?: string;
  lastIndex?: boolean;
  messageVerifyFallback?: string;
}

const CardProfile: FC<Props> = ({
  onPress,
  icon,
  label,
  type,
  hasRightIcon,
  isShowHint = false,
  messageVerify,
  lastIndex,
  messageVerifyFallback
}) => {
  let iconName = 'alert-outline';
  let color = COLORS.red;
  if (type === 'PENDING') {
    iconName = 'alert-box-outline';
    color = COLORS.white;
  } else if (type === 'REJECT') {
    iconName = 'close-circle-outline';
    color = COLORS.red;
  }
  const hintMessageKyc = () => {
    return (
      <Text
        style={{
          color,
          paddingHorizontal: resWidth(40),
          marginTop: -SPACING.s_12,
          paddingBottom: SPACING.s_12,
          fontStyle: 'italic',
          fontSize: resFont(12),
        }}>
        {`(${messageVerify || messageVerifyFallback})`}
      </Text>
    );
  };
  return (
    <View style={styles.containerWrap}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <ProgressiveImage source={icon} style={{width: 24, aspectRatio: 1}} />
        <Text style={styles.label}>{label}</Text>
        {hasRightIcon && (
          <>
            <Icon name={iconName} size={SPACING.l_24} color={color} />
          </>
        )}
      </TouchableOpacity>
      {isShowHint && hintMessageKyc()}
      {!lastIndex && (
        <View
          style={{
            height: 4,
            top: -4,
            opacity: 0.5,
          }}
        />
      )}
    </View>
  );
};

const AccountScreens = () => {
  const { t } = useTranslation();
  const ACCOUNT_MENU = useAccountMenu();
  const navigation = useNavigation();
  const {getUserInfo} = useAccount();
  const {getInfoKyc, infoKyc} = useAccountKyc();
  const isVerify = infoKyc && infoKyc.isVerify;
  const accountVerify = useAppSelector(AccountSelector.getVerifyUser);
  useFocusEffect(
    useCallback(() => {
      getUserInfo();
      getInfoKyc();
    }, []),
  );

  const navigateVerifyAccount = () => {
    if (
      !infoKyc?.statusVerify ||
      infoKyc?.statusVerify === 'REJECT' ||
      infoKyc?.statusVerify === 'NONE'
    ) {
      //@ts-ignore
      navigation.navigate(STACK_NAVIGATOR.VERIFY_ACCOUNT, {infoKyc});
    } else if (infoKyc?.statusVerify === 'PENDING') {
      //@ts-ignore
      navigation.navigate(STACK_NAVIGATOR.PREVIEW_ACCOUNT, {infoKyc});
    }
  };

  const headerInfo = (
    <View style={styles.headerContainer}>
      <Text style={styles.header}>{t('account.yourAccount')}</Text>
    </View>
  );

  return (
    <LinearGradient {...Screen.linearBackground} style={{flex: 1}}>
      <Container edges={['bottom']}>
        {headerInfo}
        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: SPACING.l_24 + resWidth(95),
            paddingHorizontal: resWidth(12)
          }}>
          <AccountHeader />
          {(!isVerify || !accountVerify) && (
            <CardProfile
              icon={Images.icon.account.iconVerify}
              label={t('account.verifyAccount')}
              onPress={navigateVerifyAccount}
              hasRightIcon
              type={infoKyc?.statusVerify}
              isShowHint={true}
              messageVerify={infoKyc?.messageVerify}
              messageVerifyFallback={t('account.verifyAccountWarning')}
            />
          )}
          {ACCOUNT_MENU.map((item, index) => {
            const {icon, label, route, url} = item;
            const onPressItem = () => {
              if (url) {
                // @ts-ignore
                navigation.navigate(route, {
                  title: label,
                  url: url,
                });
              } else {
                // @ts-ignore
                navigation.navigate(route);
              }
            };
            return (
              <CardProfile
                key={label}
                icon={icon}
                label={label}
                onPress={onPressItem}
                lastIndex={index === ACCOUNT_MENU.length - 1}
              />
            );
          })}
          <Text
            style={{
              fontFamily: 'Roboto',
              fontSize: resFont(12),
              fontStyle: 'italic',
              textAlign: 'center',
              color: COLORS.white,
              paddingTop: SPACING.s_12,
            }}>
            Version: {Platform.appVersion}-b0
          </Text>
        </ScrollView>
      </Container>
    </LinearGradient>
  );
};
export default AccountScreens;
