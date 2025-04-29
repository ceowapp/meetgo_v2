/* eslint-disable import/no-extraneous-dependencies */
import AsyncStorage from '@react-native-async-storage/async-storage';
import assign from 'lodash/assign';
import Reactotron from 'reactotron-react-native';
import {reactotronRedux as reduxPlugin} from 'reactotron-redux';

declare global {
  interface Console {
    tron: typeof Reactotron & {
      log: (...args: unknown[]) => void;
    };
  }
}
Reactotron.setAsyncStorageHandler &&
  Reactotron.setAsyncStorageHandler(AsyncStorage);
// Config name and network
Reactotron.configure({
  name: 'Meetgo',
  host: '192.168.1.6',
  // port: 9091
});

// Add some more plugins for redux & redux-sag
Reactotron.use(reduxPlugin());
Reactotron.useReactNative();

// If we're running in DEV mode, then let's connect!
if (__DEV__) {
  Reactotron.connect();
  Reactotron.clear && Reactotron.clear();
}

assign(console, {tron: Reactotron});
export default Reactotron;
