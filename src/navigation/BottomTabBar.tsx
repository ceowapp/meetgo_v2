import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {CommonActions} from '@react-navigation/native';
import React, {FC, memo, useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {BottomNavigation} from 'react-native-paper';
import Images from 'utils/Images';
import {hitSlop, shadow} from 'utils/mixins';
import {resFont, resWidth} from 'utils/Screen';
import {BOTTOM_TAB_HEIGHT} from 'utils/sizes';
import {COLORS, SPACING} from 'utils/styleGuide';
import {STACK_NAVIGATOR} from './types';

const styles = StyleSheet.create({
  tabBar: {
    height: BOTTOM_TAB_HEIGHT,
    width: '100%',
    backgroundColor: '#2E2EAA',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: resWidth(10),
    borderTopRightRadius: resWidth(10),
  },
  tab: {
    flex: 1,
    // paddingTop: resWidth(22),
    alignItems: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    zIndex: 999,
  },
  tabTxt: {
    fontFamly: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(12),
    lineHeight: resWidth(16),
    textAlign: 'center',
    color: COLORS.white,
  },
  icon: {
    width: resWidth(30),
    height: resWidth(30),
  },
  focus: {
    backgroundColor: COLORS.backgroundWhite30,
    borderBottomLeftRadius: resWidth(10),
    borderBottomRightRadius: resWidth(10),
    paddingHorizontal: SPACING.s_8,
    paddingBottom: SPACING.s_6,
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: COLORS.backgroundBlack50,
    shadowRadius: 10,
  },
});

function IconTabBar(name: string, isFocused: boolean) {
  switch (name) {
    case STACK_NAVIGATOR.BOTTOM_TAB.HOME: {
      return (
        <Image
          source={Images.icon.bottomTab.home}
          resizeMode="contain"
          style={styles.icon}
        />
      );
    }
    case STACK_NAVIGATOR.BOTTOM_TAB.LOCATION_NFT: {
      return (
        <Image
          source={Images.icon.bottomTab.location}
          resizeMode="contain"
          style={styles.icon}
        />
      );
    }
    case STACK_NAVIGATOR.BOTTOM_TAB.MEET_SCAN: {
      return (
        <Image
          source={Images.icon.bottomTab.scan}
          resizeMode="contain"
          style={styles.icon}
        />
      );
    }
    case STACK_NAVIGATOR.BOTTOM_TAB.ACCOUNT: {
      return (
        <Image
          source={Images.icon.bottomTab.account}
          resizeMode="contain"
          style={styles.icon}
        />
      );
    }
  }
}
const BottomTabBar: FC<BottomTabBarProps> = ({
  state,
  insets,
  navigation,
  descriptors,
}) => {
  return (
    <View style={styles.tabBar}>
      <View style={styles.tabsContainer}>
        {state?.routes.map((route: any, index: number) => {
          const {options} = descriptors[route.key];

          const isFocused = state.index === index;
          const label: string = options.tabBarLabel || route.name;
          const labelColor = isFocused ? COLORS.primaryBlack : COLORS.grey1;
          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.name}
              hitSlop={{bottom: 10, left: 10, right: 10, top: 10}}
              accessibilityRole="button"
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tab}>
              <View
                style={[
                  {
                    alignItems: 'center',
                    paddingTop: resWidth(22),
                  },
                  isFocused ? styles.focus : undefined,
                ]}>
                {IconTabBar(route.name, isFocused)}
                <Text style={styles.tabTxt}>{label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
export default memo(BottomTabBar);
