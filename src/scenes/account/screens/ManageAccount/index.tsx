import CommonHeader from 'components/CommonHeader';
import Container from 'components/Container';
import {navigateScreen} from 'navigation/RootNavigation';
import {STACK_NAVIGATOR} from 'navigation/types';
import React from 'react';
import {Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Button, Divider, Text} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import accountApi from 'scenes/account/redux/api';
import {AuthActions} from 'scenes/auth/redux/slice';
import {useAppDispatch} from 'storeConfig/hook';
import Images from 'utils/Images';
import {shadow} from 'utils/mixins';
import { useTranslation } from 'react-i18next';
import Screen, {resFont, resWidth} from 'utils/Screen';

import {COLORS, SPACING} from 'utils/styleGuide';

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    paddingBottom: SPACING.m_16,
  },
  txt: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(14),
    lineHeight: SPACING.m_16,
    color: COLORS.white,
  },
});

const ManageAccount = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const {top} = useSafeAreaInsets();
  const logout = () => {
    dispatch(AuthActions.logoutApp());
  };
  const logoutAndDeleteAccount = () => {
    dispatch(AuthActions.logoutApp());
    accountApi.apiDeleteAccount();
  };
  const onNavigate = (route: string) => {
    navigateScreen(route);
  };

  const SUB_MENU = [
    {
      title: t('account.profileUpdate'),
      icon: 'account-edit-outline',
      route: STACK_NAVIGATOR.UPDATE_ACCOUNT,
    },
    // {
    //   title: 'Liên kết tài khoản business',
    //   icon: 'account-lock-open-outline',
    //   route: STACK_NAVIGATOR.UPDATE_ACCOUNT,
    // },
  ];

  const warningDelete = () => {
    Alert.alert(
      t('account.deleteWarningTitle'),
      t('account.deleteWarningMessage'),
      [
        {
          text: t('account.stopDeleteAction'),
        },
        {
          text: t('account.continueDeleteAction'),
          style: 'destructive',
          onPress: logoutAndDeleteAccount,
        },
      ],
    );
  };

  const headerInfo = (
    <CommonHeader
      title={t('account.manageAccount')}
      containerStyle={[
        styles.header,
        {
          height: top + resWidth(44),
        },
      ]}
    />
  );
  return (
    <LinearGradient {...Screen.linearBackground} style={{flex: 1}}>
      {headerInfo}
      <Container edges={['bottom']}>
        {SUB_MENU.map(e => (
          <React.Fragment key={e.title}>
            <View
              style={{
                paddingVertical: SPACING.s_12,
                backgroundColor: COLORS.backgroundWhite10,
                marginTop: SPACING.l_24,
              }}>
              <TouchableOpacity
                onPress={() => onNavigate(e.route)}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingHorizontal: SPACING.m_16,
                  ...shadow(),
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    source={Images.icon.account.iconPen}
                    style={{
                      width: SPACING.l_24,
                      aspectRatio: 1,
                      marginRight: SPACING.m_16,
                    }}
                  />
                  <Text style={styles.txt}>{e.title}</Text>
                </View>
                <Icon
                  name="chevron-right"
                  size={SPACING.l_24}
                  color={COLORS.white}
                />
              </TouchableOpacity>
            </View>
            {/* <Divider /> */}
          </React.Fragment>
        ))}

        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            paddingHorizontal: SPACING.s_12,
          }}>
          <Button
            mode="contained"
            style={{
              borderColor: COLORS.primaryPink,
              borderRadius: SPACING.s_12,
              marginBottom: SPACING.s_12,
              backgroundColor: COLORS.primaryPink,
            }}
            onPress={warningDelete}>
            <Text style={{color: COLORS.white}}>{t('account.deleteAccount')}</Text>
          </Button>
          <Button
            mode="outlined"
            style={{
              borderColor: COLORS.primaryPink,
              borderRadius: SPACING.s_12,
            }}
            onPress={logout}>
            <Text style={{color: COLORS.primaryPink}}>{t('account.signOut')}</Text>
          </Button>
        </View>
      </Container>
    </LinearGradient>
  );
};
export default ManageAccount;
