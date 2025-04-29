import React, {FC, memo} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {EStatusLocation} from 'scenes/locations/redux/type';
import Images from 'utils/Images';
import {SPACING} from 'utils/styleGuide';

const styles = StyleSheet.create({
  iconLocationContainer: {
    width: SPACING.l_48,
    height: SPACING.l_48,
  },
  img: {
    width: '100%',
    height: '100%',
  },
});
const IconLocation: FC<{statusLocation: EStatusLocation}> = ({
  statusLocation,
}) => {
  let iconImage = Images.icon.locationBuy;
  if (statusLocation === EStatusLocation.SHOP) {
    iconImage = Images.icon.locationShop;
  } else if (statusLocation === EStatusLocation.PENDING) {
    iconImage = Images.icon.locationPending;
  } else if (statusLocation === EStatusLocation.GIFT) {
    iconImage = Images.icon.locationGift;
  }
  return (
    <View style={styles.iconLocationContainer}>
      <Image source={iconImage} resizeMode="contain" style={styles.img} />
    </View>
  );
};
export default memo(IconLocation);
