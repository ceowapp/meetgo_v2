import {Platform as NativePlatform} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import Config from 'react-native-config';
const PLATFORM = NativePlatform.OS;
const isAndroid = PLATFORM === 'android';
const isIos = PLATFORM === 'ios';
const isEmulator = async (): Promise<boolean> => {
  return DeviceInfo.isEmulator();
};
const deviceId = DeviceInfo.getUniqueIdSync();
const androidVersion = isAndroid ? NativePlatform.Version : 0;
const hasNotch = DeviceInfo.hasNotch();
const appVersion = DeviceInfo.getVersion();
const isSupportTranslucentBar = (isIos && !hasNotch) || androidVersion >= 21;
const appBuildNumber = DeviceInfo.getBuildNumber();

const isDev = __DEV__;
const isBuildProduction = !__DEV__ && Config.IS_TEST_MODE === 'false';
const isBuildTest = !__DEV__ && Config.IS_TEST_MODE === 'true';
const Platform = {
  isDev,
  isIos,
  isAndroid,
  isEmulator,
  isSupportTranslucentBar,
  appBuildNumber,
  deviceId,
  appVersion,
  OS: PLATFORM,
  Version: NativePlatform.Version,
  isBuildProduction,
  isBuildTest,
};

export default Platform;
