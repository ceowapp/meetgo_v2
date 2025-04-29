import {StyleSheet} from 'react-native';
import {COLORS} from 'utils/styleGuide';

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    ...StyleSheet.absoluteFillObject,
  },
  finder: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  maskOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  maskInner: {
    backgroundColor: COLORS.transparent,
  },
  maskRow: {
    width: '100%',
  },
  maskCenter: {
    flexDirection: 'row',
    display: 'flex',
  },
  topLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  topRight: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  bottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  animatedLine: {
    position: 'absolute',
    zIndex: 1,
  },
  flex: {
    flex: 1,
  },
});

export default styles;
