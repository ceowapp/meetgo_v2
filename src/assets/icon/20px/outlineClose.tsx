import React from 'react';
import {ViewStyle} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from 'utils/styleGuide';

interface Props {
  opacity?: number;
  style?: ViewStyle;
  color?: string;
}

const OutlineClose: React.FC<Props> = ({
  opacity = 1,
  style: styleProps,
  color = COLORS.primaryBlack,
}) => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={styleProps}
      opacity={opacity}>
      <Path
        d="M13.3939 6.5365L6.46701 13.7488"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M13.5342 13.6088L6.32183 6.68186"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default OutlineClose;
