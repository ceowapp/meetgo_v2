import React, {FC} from 'react';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {List, Text} from 'react-native-paper';
import {EStatusLocation, IResNearByMe} from 'scenes/locations/redux/type';
import {COLORS, SPACING} from 'utils/styleGuide';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Images from 'utils/Images';
import {useNavigation} from '@react-navigation/native';
import {STACK_NAVIGATOR} from 'navigation/types';
import {perWidth, resFont, resWidth} from 'utils/Screen';
import {shadow} from 'utils/mixins';

type IProps = {
  item: IResNearByMe;
};

const styles = StyleSheet.create({
  owner: {
    backgroundColor: COLORS.backgroundWhite10,
    padding: SPACING.s_6,
    marginTop: SPACING.s_4,
    borderRadius: SPACING.s_4,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow(),
  },
  distance: {
    backgroundColor: COLORS.backgroundWhite10,
    padding: SPACING.s_6,
    marginLeft: SPACING.m_16,
    marginTop: SPACING.s_4,
    borderRadius: SPACING.s_4,
    flexDirection: 'row',
    alignItems: 'center',
    ...shadow(),
  },
  iconContainer: {
    width: SPACING.l_48,
    height: SPACING.l_48,
    marginLeft: SPACING.m_16,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  shop: {
    backgroundColor: COLORS.green,
    padding: SPACING.s_6,
    marginLeft: SPACING.m_16,
    marginTop: SPACING.s_4,
    borderRadius: SPACING.s_4,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.white,
  },
  item: {
    fontFamily: 'Roboto',
    fontWeight: '400',
    fontSize: resFont(12),
    lineHeight: resWidth(16),
    color: COLORS.white,
  },
  w30: {
    maxWidth: perWidth(30),
  },
  icon: {
    paddingRight: SPACING.s_6,
  },
});
const ItemLocation: FC<IProps> = ({item}) => {
  const {navigate} = useNavigation();
  const navigateMap = () => {
    //@ts-ignore
    navigate(STACK_NAVIGATOR.LOCATION_MAP, {
      locationNFT: item,
    });
  };

  const onNavigateEarning = () => {
    // @ts-ignore
    navigate(STACK_NAVIGATOR.EARN, {
      locationID: item?.id,
      address: item?.address,
      owner: item?.owner,
      imageShopLocation: item?.imageShopLocation,
    });
  };

  const renderIconType = () => {
    let iconImage = Images.icon.locationBuy;
    if (item.statusLocation === EStatusLocation.SHOP) {
      iconImage = Images.icon.locationShop;
    } else if (item.statusLocation === EStatusLocation.PENDING) {
      iconImage = Images.icon.locationPending;
    }
    return (
      <View style={styles.iconContainer}>
        <Image source={iconImage} resizeMode="contain" style={styles.img} />
      </View>
    );
  };
  const description = () => {
    return (
      <View style={{flexDirection: 'row'}}>
        <View style={styles.owner}>
          <Icon
            name="account-outline"
            size={16}
            color={'white'}
            style={styles.icon}
          />
          <Text numberOfLines={1} style={[styles.item, styles.w30]}>
            {item.owner}
          </Text>
        </View>
        <View style={styles.distance}>
          <Text style={styles.item}>{item.distanceInKm} km</Text>
        </View>
        {item.statusLocation === EStatusLocation.SHOP && (
          <TouchableOpacity style={styles.shop} onPress={onNavigateEarning}>
            <Text style={styles.item}>Earning</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };
  return (
    <List.Item
      title={item.visionAddress || item.address}
      titleStyle={styles.item}
      titleNumberOfLines={2}
      description={description}
      left={renderIconType}
      onPress={navigateMap}
    />
  );
};
export default ItemLocation;
