import React from 'react';
import {ViewStyle} from 'react-native';
import Svg, {Path} from 'react-native-svg';
import {COLORS} from 'utils/styleGuide';

interface Props {
  style?: ViewStyle;
  fill?: string;
}

const OutlineCheckMark: React.FC<Props> = ({
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
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.27617 8.94135C5.64439 8.57312 6.2414 8.57312 6.60962 8.94135L8.60978 10.9415L13.2751 6.27617C13.6433 5.90794 14.2403 5.90794 14.6086 6.27617C14.9768 6.64439 14.9768 7.2414 14.6086 7.60962L8.77089 13.4473C8.68192 13.5363 8.53768 13.5363 8.44871 13.4473L8.44692 13.4456C8.43732 13.4383 8.42809 13.4302 8.41932 13.4215L7.27457 12.2767L7.27632 12.275L5.27617 10.2748C4.90794 9.90658 4.90794 9.30957 5.27617 8.94135Z"
        fill={fill}
      />
    </Svg>
  );
};

export default OutlineCheckMark;
