import React from 'react';
import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import {hitSlop, shadow} from 'utils/mixins';
import {resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';

type Props = {
  testID?: string;
  containerStyle?: ViewStyle;
  onPress?: () => void;
  disabled?: boolean;
  hasShadow?: boolean;
  size?: number;
  backgroundColor?: string;
  children: any;
};
const DEFAULT_SIZE = resWidth(32);
const styles = StyleSheet.create({
  container: {
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const CircleButton: React.FC<Props> = ({
  testID,
  containerStyle,
  onPress,
  children,
  disabled,
  hasShadow = false,
  size,
  backgroundColor = COLORS.primaryWhite,
}) => {
  const sizeIcon = {
    width: size || DEFAULT_SIZE,
    height: size || DEFAULT_SIZE,
  };
  const btnStyles = StyleSheet.flatten([
    containerStyle,
    styles.container,
    hasShadow && shadow('sharp'),
    sizeIcon,
    {backgroundColor},
  ]);
  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      hitSlop={hitSlop(SPACING.s_8)}
      style={btnStyles}
      disabled={disabled}>
      {children}
    </TouchableOpacity>
  );
};

export default CircleButton;
