/* eslint-disable react-native/no-unused-styles */
import React, {FC} from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import renderNode from 'utils/NodeView';
import {COLORS, SPACING} from 'utils/styleGuide';
import {
  BUTTON_HEIGHT,
  BUTTON_SMALL_WIDTH,
  BUTTON_TINY_HEIGHT,
  BUTTON_TINY_WIDTH,
} from 'utils/sizes';
import {resFont, resWidth} from 'utils/Screen';
import {ActivityIndicator, Text} from 'react-native-paper';

type MainButtonType = 'large' | 'small' | 'tiny' | 'square';
export interface MainButtonProps {
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  isLoading?: boolean;
  type?: MainButtonType;
  content: string | React.ReactElement;
  onPress: () => void;
  testID?: string;
}
const styles = StyleSheet.create({
  common: {
    backgroundColor: COLORS.primary,
    borderRadius: SPACING.s_8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  large: {
    width: '100%',
    height: BUTTON_HEIGHT,
  },
  small: {
    height: BUTTON_HEIGHT,
    width: BUTTON_SMALL_WIDTH,
  },
  square: {
    height: BUTTON_HEIGHT,
    aspectRatio: 1,
  },
  tiny: {
    height: BUTTON_TINY_HEIGHT,
    width: BUTTON_TINY_WIDTH,
  },
  disabled: {
    backgroundColor: COLORS.grey5,
  },
  title: {
    color: COLORS.primaryWhite,
    textAlign: 'center',
  },
  statusDemi: {
    fontSize: resFont(12),
    lineHeight: resWidth(18),
  },
  bodyDemi: {
    fontSize: resFont(14),
    lineHeight: resWidth(22),
  },
});

export const ButtonPrimary: FC<MainButtonProps> = ({
  onPress,
  disabled,
  isLoading,
  content,
  containerStyle,
  titleStyle,
  type = 'large',
  testID = '',
}) => {
  const finalContainerStyle = StyleSheet.flatten([
    styles.common,
    styles[type],
    containerStyle,
    disabled && styles.disabled,
  ]);

  const finalTitleStyle = StyleSheet.flatten([
    styles.title,
    type === 'tiny' ? styles.statusDemi : styles.bodyDemi,
    titleStyle,
  ]);

  return (
    <TouchableOpacity
      testID={testID}
      onPress={onPress}
      style={finalContainerStyle}
      disabled={disabled || isLoading}>
      {isLoading ? (
        <ActivityIndicator animating={true} color={COLORS.white} size="small" />
      ) : (
        renderNode(Text, content, {
          style: finalTitleStyle,
        })
      )}
    </TouchableOpacity>
  );
};
