import React, {useLayoutEffect} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {AppStackParamList} from 'navigation/types';
import RnWebview from 'react-native-webview';
import {StyleSheet} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Screen, {resWidth} from 'utils/Screen';
import CommonHeader from 'components/CommonHeader';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {SPACING} from 'utils/styleGuide';

const styles = StyleSheet.create({
  containerWebview: {
    opacity: 0.99,
    overflow: 'hidden',
    paddingHorizontal: SPACING.m_16,
  },
  header: {
    alignItems: 'flex-end',
    paddingBottom: SPACING.m_16,
  },
});
const Webview = () => {
  const navigation = useNavigation();
  const route = useRoute<RouteProp<AppStackParamList, 'WEB_VIEW'>>();
  const {title = '', url = ''} = route.params;
  const {top} = useSafeAreaInsets();
  useLayoutEffect(() => {
    navigation.setOptions({
      title: title,
    });
  }, []);
  return (
    <LinearGradient {...Screen.linearBackground} style={{flex: 1}}>
      <CommonHeader
        title={title}
        containerStyle={[
          styles.header,
          {
            height: top + resWidth(44),
          },
        ]}
      />
      <RnWebview
        style={styles.containerWebview} // https://github.com/react-native-webview/react-native-webview/issues/811
        useWebView2
        javaScriptEnabled
        domStorageEnabled
        androidHardwareAccelerationDisabled
        source={{
          uri: url,
        }}
        scalesPageToFit
        viewportContent="width=device-width, user-scalable=no"
      />
    </LinearGradient>
  );
};
export default Webview;
