import {PixelRatio} from 'react-native';
import {resWidth} from 'utils/Screen';
import DeviceInfo from 'react-native-device-info';
import Platform from 'utils/Platform';

export const HEADER_SEARCH_HEIGHT = resWidth(74);
export const COMMON_HEADER_HEIGHT = resWidth(60);
export const BOTTOM_PANEL_HEIGHT = resWidth(84);
export const BOTTOM_TAB_HEIGHT =
  Platform.isIos && DeviceInfo.hasNotch() ? resWidth(96) : resWidth(86);
export const TOAST_HEIGHT = resWidth(48);
export const TEXT_FIELD_HEIGHT = resWidth(56);
// Card
export const CARD_BANNER_WIDTH = resWidth(343);
export const CARD_BANNER_HEIGHT = resWidth(155);

export const TAB_TOP_HEIGHT = resWidth(57);
// Button
export const BUTTON_HEIGHT = resWidth(44);
export const BUTTON_SMALL_WIDTH = resWidth(142);
export const BUTTON_TINY_WIDTH = resWidth(85);
export const BUTTON_TINY_HEIGHT = resWidth(32);
// Voucher
export const VOUCHER_WIDTH = resWidth(318);
export const VOUCHER_HEIGHT = resWidth(172);
// Card
export const CARD_NEWS_WIDTH = resWidth(300);
export const CARD_NEWS_HEIGHT = resWidth(218);
export const CARD_REWARD_NORMAL_HEIGHT = PixelRatio.roundToNearestPixel(
  resWidth(172),
);
export const CARD_REWARD_NORMAL_WIDTH = PixelRatio.roundToNearestPixel(
  resWidth(318),
);
export const CARD_REWARD_COLORFUL_HEIGHT = PixelRatio.roundToNearestPixel(
  resWidth(149),
);
export const CARD_REWARD_COLORFUL_WIDTH = PixelRatio.roundToNearestPixel(
  resWidth(262),
);
export const CARD_REWARD_SIMPLE_HEIGHT = PixelRatio.roundToNearestPixel(
  resWidth(144),
);
export const CARD_REWARD_SIMPLE_WIDTH = PixelRatio.roundToNearestPixel(
  resWidth(343),
);
export const CARD_GAME_HEIGHT = resWidth(264);
export const CARD_GAME_WIDTH = resWidth(164);
export const CARD_BOTTOM_AUTO_REDEEM = Platform.isIos
  ? resWidth(443) + resWidth(12)
  : resWidth(443) - resWidth(12);
