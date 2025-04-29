import {useNavigation} from '@react-navigation/native';
import {TransitionPresets} from '@react-navigation/stack';
import React from 'react';
import {StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FutureScreen from 'scenes/account/screens/FutureScreen';
import ManageAccount from 'scenes/account/screens/ManageAccount';
import PreviewKyc from 'scenes/account/screens/PreviewKyc';
import UpdateAccount from 'scenes/account/screens/UpdateAccount';
import VerifyAccount from 'scenes/account/screens/VerifyAccount';
import LanguageSetting from 'scenes/language';
import OnboardingScreen from 'scenes/auth/screens/OnBoarding';
import ReferralList from 'scenes/account/screens/ReferralList';
import EarningScreen from 'scenes/earn/screens/Earning';
import HistoryEarnScreen from 'scenes/earn/screens/HistoryEarn';
import MyQr from 'scenes/home/screens/MyQr';
import LocationDetail from 'scenes/locations/screens/LocationDetail';
import LocationMapScreens from 'scenes/locations/screens/LocationMaps';
import HistoryMeetScreen from 'scenes/meets/screens/History';
import HistoryDetail from 'scenes/meets/screens/HistoryMeetDetail';
import HistoryPointScreen from 'scenes/meets/screens/HistoryPoint';
import MeetTogether from 'scenes/meets/screens/MeetTogether';
import UserScan from 'scenes/meets/screens/UserScan';
import Webview from 'scenes/webview';
import {SPACING} from 'utils/styleGuide';
import BottomTabNavigator from './BottomTabNavigator';
import {AppStack, STACK_NAVIGATOR} from './types';

const styles = StyleSheet.create({
  iconBack: {
    width: SPACING.l_32,
    height: SPACING.l_32,
  },
});
export const backIcon = () => {
  const {goBack} = useNavigation();
  return (
    <Icon
      name="chevron-left"
      size={32}
      onPress={goBack}
      style={styles.iconBack}
    />
  );
};

function AppNavigator(): React.ReactElement {
  return (
    <>
      <AppStack.Screen
        name={STACK_NAVIGATOR.BOTTOM_TAB_BAR}
        key={STACK_NAVIGATOR.BOTTOM_TAB_BAR}
        component={BottomTabNavigator}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.LOCATION_MAP}
        key={STACK_NAVIGATOR.LOCATION_MAP}
        component={LocationMapScreens}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.LOCATION_DETAIL}
        key={STACK_NAVIGATOR.LOCATION_DETAIL}
        component={LocationDetail}
        // options={{
        //   headerShown: true,
        //   headerLeftLabelVisible: false,
        //   headerTitleAlign: 'center',

        //   headerLeft: backIcon,
        // }}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.MANAGE_ACC}
        key={STACK_NAVIGATOR.MANAGE_ACC}
        component={ManageAccount}
        // options={{
        //   headerShown: true,
        //   headerTitle: t('navigation.manage_account'),
        //   headerTitleAlign: 'center',
        //   headerLeftLabelVisible: false,
        //   headerLeft: backIcon,
        // }}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.MY_QR}
        key={STACK_NAVIGATOR.MY_QR}
        component={MyQr}
        options={{
          headerShown: false,
          ...TransitionPresets.ModalSlideFromBottomIOS,
        }}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.USER_SCAN}
        key={STACK_NAVIGATOR.USER_SCAN}
        component={UserScan}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.MEET_TOGETHER}
        key={STACK_NAVIGATOR.MEET_TOGETHER}
        component={MeetTogether}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.VERIFY_ACCOUNT}
        key={STACK_NAVIGATOR.VERIFY_ACCOUNT}
        component={VerifyAccount}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.PREVIEW_ACCOUNT}
        key={STACK_NAVIGATOR.PREVIEW_ACCOUNT}
        component={PreviewKyc}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.UPDATE_ACCOUNT}
        key={STACK_NAVIGATOR.UPDATE_ACCOUNT}
        component={UpdateAccount}
        // options={{
        //   headerShown: true,
        //   headerTitle: t('navigation.update_account'),
        //   headerLeftLabelVisible: false,
        //   headerLeft: backIcon,
        // }}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.HISTORY_MEET}
        key={STACK_NAVIGATOR.HISTORY_MEET}
        component={HistoryMeetScreen}
        // options={{
        //   headerShown: true,
        //   headerTitle: t('navigation.meet_history'),
        //   headerLeftLabelVisible: false,
        //   headerLeft: backIcon,
        // }}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.HISTORY_POINT}
        key={STACK_NAVIGATOR.HISTORY_POINT}
        component={HistoryPointScreen}
        // options={{
        //   headerShown: true,
        //   headerTitle: t('navigation.transaction_history'),
        //   headerLeftLabelVisible: false,
        //   headerLeft: backIcon,
        // }}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.HISTORY_MEET_DETAIL}
        key={STACK_NAVIGATOR.HISTORY_MEET_DETAIL}
        component={HistoryDetail}
        // options={{
        //   headerShown: true,
        //   headerTitle: t('navigation.transaction_details'),
        //   headerLeftLabelVisible: false,
        //   headerLeft: backIcon,
        // }}
      />

      <AppStack.Screen
        name={STACK_NAVIGATOR.WEB_VIEW}
        key={STACK_NAVIGATOR.WEB_VIEW}
        component={Webview}
      />
      <AppStack.Screen
        name={'futureScreen'}
        key={'futureScreen'}
        component={FutureScreen}
        //options={{
          //headerTitle: t('navigation.future_screen'),
          //headerShown: true,
          //headerLeftLabelVisible: false,
          //headerLeft: backIcon,
        //}}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.EARN}
        key={STACK_NAVIGATOR.EARN}
        component={EarningScreen}
        options={{
          headerShown: false,
        }}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.HISTORY_EARN}
        key={STACK_NAVIGATOR.HISTORY_EARN}
        component={HistoryEarnScreen}
        // options={{
        //   headerTitle: t('navigation.earning_history'),
        //   headerShown: true,
        //   headerLeftLabelVisible: false,
        //   headerLeft: backIcon,
        // }}
      />
        <AppStack.Screen
        name={STACK_NAVIGATOR.REFERRAL_LIST}
        key={STACK_NAVIGATOR.REFERRAL_LIST}
        component={ReferralList}
        options={{
          headerShown: false,
        }}
        //options={{
        //  headerTitle: t('navigation.referral_list'),
          //headerShown: true,
        //headerLeftLabelVisible: false,
        //  headerTitleAlign: 'center',
          //headerLeft: backIcon,
        //}}
      />
      <AppStack.Screen
        name={STACK_NAVIGATOR.LANGUAGE_SETTING}
        key={STACK_NAVIGATOR.LANGUAGE_SETTING}
        component={LanguageSetting}
        //options={{
        // headerTitle: t('navigation.language'),
         // headerShown: true,
          //headerLeftLabelVisible: false,
        // headerTitleAlign: 'center',
          //headerLeft: backIcon,
        //}}
      />
    </>
  );
}
export default AppNavigator;

