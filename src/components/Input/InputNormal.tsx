import React, {FC} from 'react';
import {StyleProp, View, ViewStyle} from 'react-native';
import {TextInputProps, TextInput, HelperText} from 'react-native-paper';
import {resFont} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';

export type IInput = TextInputProps & {
  placeholder?: string;
  onValidate?: () => boolean;
  errorMess?: string;
  icon?: string;
  containerInputStyle?: StyleProp<ViewStyle>;
};
const InputNormal: FC<IInput> = ({
  placeholder,
  onChangeText,
  onValidate,
  errorMess,
  icon,
  containerInputStyle = null,
  ...rest
}) => {
  return (
    <View style={containerInputStyle}>
      <TextInput
        mode="outlined"
        placeholder={placeholder}
        onChangeText={onChangeText}
        underlineColor={COLORS.grey3}
        textColor={COLORS.primary}
        activeOutlineColor={
          onValidate && onValidate() ? COLORS.error : COLORS.blue
        }
        autoCorrect={false}
        spellCheck={false}
        style={{
          backgroundColor: COLORS.white,
          marginTop: SPACING.s_6,
          borderTopLeftRadius: SPACING.s_8,
          borderTopRightRadius: SPACING.s_8,
          borderRadius: SPACING.s_8,
        }}
        left={icon ? <TextInput.Icon icon={icon} size={SPACING.l_24} /> : null}
        {...rest}
      />
      {onValidate && onValidate() ? (
        <HelperText
          type="error"
          visible={onValidate()}
          padding="normal"
          style={{
            fontSize: resFont(12),
            color: COLORS.pastelRed,
          }}>
          {errorMess}
        </HelperText>
      ) : (
        <></>
      )}
    </View>
  );
};
export default InputNormal;
