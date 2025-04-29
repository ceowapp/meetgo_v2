import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import {useAppSelector} from 'storeConfig/hook';
import {COLORS, SPACING} from 'utils/styleGuide';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AccountSelector} from 'scenes/account/redux/slice';
import Logo from 'components/Logo';
import {navigateScreen} from 'navigation/RootNavigation';
import {resFont, resWidth} from 'utils/Screen';
import { useTranslation } from 'react-i18next';

const style = StyleSheet.create({
  title: {
    color: COLORS.primaryWhite,
    paddingLeft: SPACING.s_4,
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(12),
    lineHeight: resWidth(14),
  },
});
const Header = () => {
  const { t } = useTranslation();
  const name = useAppSelector(AccountSelector.getFullName);
  const avatar = useAppSelector(AccountSelector.getAvatar);
  const renderAvatar = avatar ? (
    <Avatar.Image source={{uri: avatar}} size={resWidth(44)} />
  ) : (
    <Logo />
  );

  const renderWelcome = () => {
    return (
      <View style={{paddingLeft: SPACING.s_4}}>
        <Text variant="titleMedium" style={style.title}>
          {t('home.hello')},
        </Text>
        <Text variant="titleMedium" style={style.title}>
          {name}!
        </Text>
      </View>
    );
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        {renderAvatar}
        {renderWelcome()}
      </View>
      <TouchableOpacity onPress={() => navigateScreen('futureScreen')}>
        <Icon
          size={SPACING.l_24}
          color={COLORS.white}
          name="bell-badge-outline"
        />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
