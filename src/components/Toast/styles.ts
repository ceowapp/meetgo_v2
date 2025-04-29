import {StyleSheet} from 'react-native';
import colors from 'services/themes/colors';
import {perWidth, resFont, resWidth} from 'utils/Screen';

const styles = StyleSheet.create({
  toast: {
    marginHorizontal: resWidth(20),
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 11,
  },
  content: {
    flexDirection: 'row',
    maxWidth: perWidth(80),
    minHeight: resWidth(37),
    borderRadius: resWidth(6),
    paddingHorizontal: resWidth(16),
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: resFont(12),
    lineHeight: resFont(20),
    textAlign: 'center',
    color: colors.surface,
    fontWeight: '400',
  },
  shareToast: {
    height: resWidth(44),
    width: perWidth(65),
    borderRadius: resWidth(22),
    backgroundColor: colors.shadow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialToast: {
    position: 'absolute',
    zIndex: 9999,
    alignSelf: 'center',
  },
  w8: {
    width: resWidth(8),
  },
});

export default styles;
