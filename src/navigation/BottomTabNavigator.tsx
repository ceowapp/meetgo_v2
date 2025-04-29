import React, {useEffect, useState} from 'react';

import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {STACK_NAVIGATOR} from './types';
import HomeScreens from 'scenes/home/screens/Home';
import LocationNFTScreens from 'scenes/locations/screens/LocationNFT';
import AccountScreens from 'scenes/account/screens/Account';
import {Image, View} from 'react-native';
import Images from 'utils/Images';
import MeetGoScreens from 'scenes/meets/screens/QrScan';
import {COLORS} from 'utils/styleGuide';
import BottomTabBar from './BottomTabBar';
import { useTranslation } from 'react-i18next';

const Tab = createBottomTabNavigator();

function customTabBar(props: BottomTabBarProps) {
  return (
    <BottomTabBar
      state={props.state}
      insets={props.insets}
      descriptors={props.descriptors}
      navigation={props.navigation}
    />
  );
}
export default function BottomTabNavigator() {
  const { t } = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={customTabBar}>
      <Tab.Screen
        name={STACK_NAVIGATOR.BOTTOM_TAB.HOME}
        component={HomeScreens}
        options={{
          tabBarLabel: t('navigation.home'),
        }}
      />
      <Tab.Screen
        name={STACK_NAVIGATOR.BOTTOM_TAB.LOCATION_NFT}
        component={LocationNFTScreens}
        options={{
          tabBarLabel: t('navigation.location'),
        }}
      />
      <Tab.Screen
        name={STACK_NAVIGATOR.BOTTOM_TAB.MEET_SCAN}
        component={MeetGoScreens}
        options={{
          tabBarLabel: 'Meet Go',
        }}
      />
      <Tab.Screen
        name={STACK_NAVIGATOR.BOTTOM_TAB.ACCOUNT}
        component={AccountScreens}
        options={{
          tabBarLabel: t('navigation.account'),
        }}
      />
    </Tab.Navigator>
  );
}
