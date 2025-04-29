import {StyleSheet} from 'react-native';
import {shadow} from 'utils/mixins';

import {perWidth, resFont, resWidth} from 'utils/Screen';
import {COLORS} from 'utils/styleGuide';

const HEADER_HEIGHT = resWidth(60);
const MIN_HEIGHT = resWidth(44);
const Styles = StyleSheet.create({
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: HEADER_HEIGHT,
    minHeight: MIN_HEIGHT,
    backgroundColor: COLORS.backgroundWhite10,
    ...shadow(),
  },
  headerLeft: {
    // width: perWidth(10),
    justifyContent: 'flex-end',
    paddingLeft: resWidth(16),
  },
  headerRight: {
    width: perWidth(15),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerTitleWrapper: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  /** TEXT */
  textTitle: {
    fontSize: resFont(14),
    lineHeight: resWidth(21),
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: '700',
    fontFamily: 'Roboto',
  },
  wrapperIcon: {
      zIndex: 999999,
    // width: resWidth(31),
    // height: resWidth(31),
    justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: COLORS.grey4,
  },
});
export default Styles;
