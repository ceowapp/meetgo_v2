import {StyleSheet} from 'react-native';
import Screen, {perWidth, resWidth, perHeight, resFont} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';

export const SLIDER_WIDTH = perWidth(100);
export const CIRCLE_SIZE = perWidth(74);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 1,
  },
  viewSlide: {
    height: perHeight(70),
  },
  slideContainer: {
    width: SLIDER_WIDTH,
    justifyContent: 'center',
  },
  sliderImage: {
    width: perWidth(100),
  },
  description: {
    textAlign: 'center',
    lineHeight: resWidth(20),
    color: COLORS.white,
    fontSize: resFont(16),
    fontFamily: 'Roboto-medium',
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtLogin: {
    paddingBottom: SPACING.s_12,
    color: COLORS.white,
    fontSize: resFont(14),
    lineHeight: resWidth(16),
    fontFamily: 'Roboto-Regular',
  },
  socialSize: {
    width: resWidth(44),
    height: resWidth(44),
  },
});

export default styles;
