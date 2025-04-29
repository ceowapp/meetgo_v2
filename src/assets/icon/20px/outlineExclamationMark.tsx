import React from 'react';
import {ViewStyle} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from 'utils/styleGuide';

interface Props {
  style?: ViewStyle;
  fill?: string;
}

const OutlineExclamationMark: React.FC<Props> = ({
  style: styleProps,
  fill = COLORS.primaryBlack,
}) => {
  return (
    <Svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      style={styleProps}>
      <Path
        d="M8.14273 4.85547C8.06574 3.85459 8.85711 3 9.86095 3C10.8648 3 11.6562 3.85459 11.5792 4.85547L11.0632 11.5637C11.0148 12.1919 10.491 12.677 9.86095 12.677C9.2309 12.677 8.70707 12.1919 8.65874 11.5637L8.14273 4.85547Z"
        fill={fill}
      />
      <Path
        d="M10.9995 15.0004C10.9993 15.6026 10.511 16.0909 9.90885 16.0909C9.30649 16.0909 8.81818 15.6023 8.81818 15C8.81818 14.3976 9.30649 13.9091 9.90885 13.9091C10.5114 13.9091 10.9998 14.3979 10.9995 15.0004Z"
        fill={fill}
      />
    </Svg>
  );
};

export default OutlineExclamationMark;
