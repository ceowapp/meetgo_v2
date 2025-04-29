import React, {FC} from 'react';
import {Image, View} from 'react-native';
import Images from 'utils/Images';
import {shadow} from 'utils/mixins';
import {SPACING} from 'utils/styleGuide';

type IPropsLogo = {
  size?: number;
};
const Logo: FC<IPropsLogo> = ({size = SPACING.l_48}) => {
  return (
    <View
      style={{
        padding: size / SPACING.s_6,
        borderRadius: size,
        width: size,
        height: size,
        backgroundColor: 'white',
        ...shadow('sharp', false),
      }}>
      <Image
        source={Images.global.logo}
        resizeMode="contain"
        style={{
          height: '100%',
          aspectRatio: 1,
        }}
      />
    </View>
  );
};
export default Logo;
