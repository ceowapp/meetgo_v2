import React, {FC, ReactElement} from 'react';
import {StyleSheet} from 'react-native';
import {
  NativeSafeAreaViewProps,
  SafeAreaView,
} from 'react-native-safe-area-context';
import colors from 'services/themes/colors';

const defaultStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.transparent,
  },
});

type IContainerProps = NativeSafeAreaViewProps;

const Container: FC<IContainerProps> = ({
  children = <></>,
  style = defaultStyles.container,
  ...rest
}): ReactElement => {
  return (
    <SafeAreaView style={[defaultStyles.container, style]} {...rest}>
      {children}
    </SafeAreaView>
  );
};

export default Container;