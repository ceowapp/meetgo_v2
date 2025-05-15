import {Dimensions, StatusBar, PixelRatio} from 'react-native';
import ExtraDimensions from 'react-native-extra-dimensions-android';
import Platform from './Platform';
import DeviceInfo from 'react-native-device-info';
import {LinearGradientProps} from 'react-native-linear-gradient';
import COLORS from 'services/themes/colors';

const {width, height} = Dimensions.get('window');
const {height: heightDevice} = Dimensions.get('screen');
const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];
const statusBarHeight = (): number =>
  Platform.isIos ? 20 : Number(StatusBar.currentHeight);
const isLargeView = shortDimension >= 600;
const isTabletMode = shortDimension / longDimension > 0.7;
const STANDARD_WINDOW = {width: 375, height: 667};
const hitSlop = {
  left: 20,
  right: 20,
  top: 20,
  bottom: 20,
};

/**
 *
  Sometimes you don't want to scale everything in a linear manner, that's where moderate scale comes in.
  The cool thing about it is that you can control the resize factor (default is 0.5).
  If normal scale will increase your size by +2X, moderateScale will only increase it by +X, for example:
  ➡️ responsiveWidth(10) = 20
  ➡️ responsiveHeight(10) = 15
  ➡️ responsiveFontSize(10, 0.1) = 11
 * @param {*} size Number
 * @param {*} factor Number : default = 0.5
 */
export const perWidth = (size: number): number =>
  PixelRatio.roundToNearestPixel((shortDimension * size) / 100);
export const perHeight = (size: number): number =>
  PixelRatio.roundToNearestPixel((longDimension * size) / 100);
export const resWidth = (size: number): number =>
  PixelRatio.roundToNearestPixel(
    (shortDimension / STANDARD_WINDOW.width) * size,
  );
export const resHeight = (size: number): number =>
  PixelRatio.roundToNearestPixel(
    (longDimension / STANDARD_WINDOW.height) * size,
  );
// export const scaleFont = (size, factor = 0.5) => size + (scaleWidth(size) - size) * factor;
export function resFont(size: number): number {
  const newSize = (size * shortDimension) / STANDARD_WINDOW.width;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
}
// const safeArea = {
//   bottom: Platform.hasNotch ? 24 : 0,
//   bottomFull: Platform.hasNotch ? 34 : 0,
//   top: Platform.hasNotch ? 34 : 0,
//   topFull: Platform.hasNotch ? 44 : 0,
// };

const headerTrueHeight = resHeight(40);
// const headerHeight = statusBarMarginH + headerTrueHeight;
// const safeTopPadding = safeArea.top + statusBarMarginH;
// const homeIndicatorHeight = Platform.hasNotch ? 34 : 0;
const isIphoneX = (): boolean =>
  Platform.isIos &&
  (height === 780 ||
    width === 780 ||
    height === 812 ||
    width === 812 ||
    height === 844 ||
    width === 844 ||
    height === 896 ||
    width === 896 ||
    height === 926 ||
    width === 926);
const getBottomDevice = (): number => {
  return isIphoneX() ? 34 : 0;
};
const getStatusBarHeight = (skipAndroid = false): number => {
  if (Platform.isAndroid) {
    if (skipAndroid) {
      return 0;
    }
    return Platform.isSupportTranslucentBar ? statusBarHeight() : 0;
  }
  if (Platform.isIos) {
    if (DeviceInfo.hasDynamicIsland()) {
      return 54;
    }
    if (isIphoneX()) {
      return 44;
    }
    return 20;
  }

  return 0;
};

const getNavigationBar = (): number => {
  if (Platform.isAndroid) {
    return heightDevice - longDimension;
  }
  return 0;
};

const getSoftMenuBarHeight = (): number => {
  if (Platform.isAndroid) {
    return ExtraDimensions.getSoftMenuBarHeight();
  }
  return 0;
};

const linearBackground: LinearGradientProps = {
  colors: COLORS.bgRadient,
  start: {x: 0, y: 0.1},
  end: {x: 1, y: 0.9},
};
const Screen = {
  headerTrueHeight,
  statusBarHeight,
  width,
  height,
  isLargeView,
  isTabletMode,
  isIphoneX,
  hitSlop,
  getBottomDevice,
  getStatusBarHeight,
  getNavigationBar,
  getSoftMenuBarHeight,
  linearBackground,
};

export default Screen;
