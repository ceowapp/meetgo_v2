import React from 'react';
import {Image, ImageSourcePropType} from 'react-native';
import OutlineExclamationMark from 'assets/icon/20px/outlineExclamationMark';
import OutlineWifiOff from 'assets/icon/20px/outlineWifiOff';
import OutlineCheckMark from 'assets/icon/20px/outlineCheckMark';
import OutlineClose from 'assets/icon/20px/outlineClose';
export const IconWrapperImg: React.FC<{
  imageSrc: ImageSourcePropType;
  size?: number;
}> = ({imageSrc, size = 48}) => {
  const imageStyle = {
    width: size,
    height: size,
  };
  return <Image source={imageSrc} style={imageStyle} />;
};

export const Icon16px = {};

export const Icon20px = {
  OutlineExclamationMark,
  OutlineWifiOff,
  OutlineCheckMark,
  OutlineClose,
};

export const Icon24px = {};

export const Icon32px = {};

export const Icon36px = {};

export const Icon48px = {};
