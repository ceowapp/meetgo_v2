import DeviceInfo from 'react-native-device-info';
import {resWidth} from 'utils/Screen';
import Platform from './Platform';

export default {
  s_4: resWidth(4),
  s_6: resWidth(6),
  s_8: resWidth(8),
  s_12: resWidth(12),
  m_16: resWidth(16),
  l_24: resWidth(24),
  l_32: resWidth(32),
  l_48: resWidth(48),
  xl_56: resWidth(56),
  xl_64: resWidth(64),
  xl_72: resWidth(72),
  xl_80: resWidth(80),
};

export const BOTTOM_TAB_HEIGHT =
  Platform.isIos && DeviceInfo.hasNotch() ? resWidth(80) : resWidth(64);
