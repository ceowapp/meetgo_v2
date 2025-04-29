import React, {FC} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';

// Utils
import {resWidth} from 'utils/Screen';

// Style
import styles from './styles';
import {ActivityIndicator, Avatar, Text} from 'react-native-paper';
import {useAppSelector} from 'storeConfig/hook';
import {COLORS, SPACING} from 'utils/styleGuide';
import {AccountSelector} from 'scenes/account/redux/slice';
import {IDataImage} from 'scenes/account/redux/types';
import useAccount from 'scenes/account/helper/useAccount';
import Logo from 'components/Logo';
import Platform from 'utils/Platform';
import Images from 'utils/Images';
import { useTranslation } from 'react-i18next';
import {ProgressiveImage} from 'components/Image/ProgressiveImage';
const optionLibrary: ImageLibraryOptions = {
  mediaType: 'photo',
  maxWidth: 500,
  maxHeight: 500,
  quality: 0.5,
  selectionLimit: 1,
};
const AccountHeader: FC = () => {
  const { t } = useTranslation();
  const avatar = useAppSelector(AccountSelector.getAvatar);
  const name = useAppSelector(AccountSelector.getFullName);
  const numberMeet = useAppSelector(AccountSelector.getNumberOfMeet);
  const meetPoint = useAppSelector(AccountSelector.getMeetpoint);
  const numberEarn = useAppSelector(AccountSelector.getNumberOfEarn);
  const {updateAvatar, loading} = useAccount();

  const onChangeAvatar = async () => {
    const result = await launchImageLibrary(optionLibrary);
    if (result && result.assets && result.assets[0].uri) {
      const data: IDataImage = {
        fileName: result.assets[0]?.fileName || 'myAvatar',
        uri: Platform.isIos
          ? result.assets[0]?.uri.replace('file://', '')
          : `file://${result.assets[0]?.uri}`,
        type: result.assets[0]?.type || 'image/jpg',
      };
      updateAvatar(data);
    }
  };
  const renderAvatar = avatar ? (
    <Avatar.Image
      source={{uri: avatar}}
      size={resWidth(80)}
      style={styles.avatarContainer}
    />
  ) : (
    <Logo size={resWidth(80)} />
  );

  const renderSectionPoint = (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text variant="titleMedium" style={styles.txtPoint}>
        {meetPoint}
      </Text>
      <ProgressiveImage
        source={Images.icon.logoPoint}
        style={{width: SPACING.l_24, aspectRatio: 1, top: -2}}
      />
    </View>
  );

  const renderSectionEarnMeet = (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Text variant="titleMedium" style={styles.txtPoint}>
        {numberMeet} {t('account.meetCount')}
      </Text>
      <Text variant="titleLarge" style={styles.sperateVertical}>
        |
      </Text>
      <Text variant="titleMedium" style={styles.txtPoint}>
        {numberEarn} {t('account.earningCount')}
      </Text>
    </View>
  );
  return (
    <View style={styles.accountHeader}>
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={onChangeAvatar}>
          {loading && (
            <ActivityIndicator
              animating
              color="white"
              style={{
                position: 'absolute',
                zIndex: 99,
                width: resWidth(80),
                height: resWidth(80),
                backgroundColor: COLORS.backgroundBlack70,
                borderRadius: resWidth(96),
              }}
            />
          )}
          {renderAvatar}
          <Text variant="titleSmall" style={styles.changeAvatar}>
            {t('account.profilePictureChange')}
          </Text>
        </TouchableOpacity>
        <View style={styles.nameContainer}>
          <Text
            theme={{colors: {primary: 'white'}}}
            variant="titleLarge"
            numberOfLines={1}
            style={styles.name}>
            {name || 'Meeter'}
          </Text>
          {renderSectionPoint}
          {renderSectionEarnMeet}
        </View>
      </View>
    </View>
  );
};

export default AccountHeader;
