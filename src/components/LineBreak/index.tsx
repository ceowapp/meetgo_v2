import React, {FC, memo} from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {COLORS} from 'utils/styleGuide';

const styles = StyleSheet.create({
  container: {
    height: 1,
    overflow: 'hidden',
  },
  line: {
    height: 1,
    borderWidth: 1,
    borderColor: COLORS.grey3,
    borderStyle: 'dashed',
  },
});
type IProps = {
  styleLine?: StyleProp<ViewStyle>;
};
const LineBreak: FC<IProps> = ({styleLine}) => (
  <View style={styles.container}>
    <View style={[styles.line, styleLine]}></View>
  </View>
);
export default memo(LineBreak);
