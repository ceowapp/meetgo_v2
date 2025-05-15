import React, { useEffect } from 'react';
import { enableScreens } from 'react-native-screens';
import {
  adaptNavigationTheme,
  MD3LightTheme,
  MD3DarkTheme,
  PaperProvider,
} from 'react-native-paper';
import appsFlyer from 'react-native-appsflyer';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import storeConfig from 'storeConfig';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { ToastContextProvider } from 'components/Toast/ContextProvider';
import NetworkInfoHandler from 'services/networkInfo';
import colors from 'services/themes/colors';
import RootNavigation from 'navigation';
import CommonManager from 'manager/commonManager';
import ConfigBoard from 'manager/commonManager/ConfigBoard';
import Platform from 'utils/Platform';
import navigationRef from 'navigation/RootNavigation';
import AppStateHanlder from 'services/appstate';
import GlobalModal from 'services/globalModal';
import MyLocation from 'services/location/MyLocation';
import ForceUpdateApp from 'services/forceUpdate';
import UpdateManager from 'manager/updateManager';
import AdManager from 'manager/adManager';
import { I18nextProvider } from 'react-i18next';
import DeepLink from 'services/deeplink';
import i18n from './i18n';

enableScreens();
const theme = {
  ...MD3DarkTheme,
};
const { LightTheme } = adaptNavigationTheme({ reactNavigationLight: DefaultTheme });

const isRelease = !__DEV__;

export default function App() {
  useEffect(() => {
    initializeServices();
    return () => {
      appsFlyer.stop(true);
    };
  }, []);

  const initializeServices = async () => {
    try {
      DeepLink.init();
      await AdManager.initialize();
    } catch (error) {
      console.error('Error initializing services:', error);
    }
  };

  return (
    <I18nextProvider i18n={i18n}>
      <Provider store={storeConfig.rootStore}>
        <PersistGate loading={null} persistor={storeConfig.persistor}>
          <PaperProvider theme={theme}>
            <NavigationContainer ref={navigationRef} theme={LightTheme}>
              <SafeAreaProvider initialMetrics={initialWindowMetrics}>
                {(Platform.isBuildTest || Platform.isDev) && <ConfigBoard />}
                <CommonManager>
                  <ToastContextProvider>
                    <NetworkInfoHandler />
                    <AppStateHanlder />
                    <RootNavigation />
                    <GlobalModal />
                    <MyLocation />
                  </ToastContextProvider>
                  <ForceUpdateApp />
                  <UpdateManager />
                </CommonManager>
              </SafeAreaProvider>
            </NavigationContainer>
          </PaperProvider>
        </PersistGate>
      </Provider>
    </I18nextProvider>
  );
}
