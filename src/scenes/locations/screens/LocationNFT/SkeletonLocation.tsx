import React from 'react';
import {perHeight} from 'utils/Screen';
import {Rect, Circle} from 'react-native-svg';
import ContentLoader from 'react-content-loader/native';
import {COLORS} from 'utils/styleGuide';

const SkeletonLocation = () => {
  return (
    <ContentLoader
      height={perHeight(50)}
      speed={1}
      backgroundColor={COLORS.grey2}
      foregroundColor={COLORS.grey3}>
      <Circle cx="45" cy="30" r="30" />
      <Rect x="100" y="10" rx="4" ry="4" width="260" height="13" />
      <Rect x="100" y="30" rx="3" ry="3" width="240" height="10" />
      <Circle cx="45" cy="100" r="30" />
      <Rect x="100" y="80" rx="4" ry="4" width="260" height="13" />
      <Rect x="100" y="100" rx="3" ry="3" width="240" height="10" />
      <Circle cx="45" cy="170" r="30" />
      <Rect x="100" y="150" rx="4" ry="4" width="260" height="13" />
      <Rect x="100" y="170" rx="3" ry="3" width="240" height="10" />
    </ContentLoader>
  );
};
export default SkeletonLocation;
