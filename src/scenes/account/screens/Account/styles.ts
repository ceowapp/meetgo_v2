import {StyleSheet} from 'react-native';
import {padding, shadow} from 'utils/mixins';
import {perHeight, perWidth, resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';

const styles = StyleSheet.create({
  accountHeader: {
    ...padding(SPACING.s_12, SPACING.l_24, SPACING.s_12, SPACING.l_24),
    backgroundColor: COLORS.transparent,
  },
  headerContainer: {
    backgroundColor: COLORS.backgroundWhite10,
    height: resWidth(85),
    justifyContent: 'flex-end',
    ...shadow(),
  },
  header: {
    fontFamily: 'Roboto-bold',
    fontWeight: '700',
    fontSize: resFont(14),
    lineHeight: resWidth(16),
    color: COLORS.primaryWhite,
    paddingBottom: SPACING.m_16,
    textAlign: 'center',
  },
  headerContent: {
    flexDirection: 'row',
  },
  avatarContainer: {
    marginRight: SPACING.l_24,
  },
  nameContainer: {
    flex: 1,
    height: resWidth(96),
    justifyContent: 'center',
  },
  name: {
    marginBottom: SPACING.s_8,
    color: COLORS.primaryWhite,
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: resFont(16),
    lineHeight: resWidth(18),
  },
  changeAvatar: {
    marginTop: SPACING.s_12,
    color: COLORS.primaryWhite,
    fontFamily: 'Roboto',
    fontSize: resFont(12),
    lineHeight: resWidth(14),
  },
  pointExpiryContainer: {
    marginTop: SPACING.s_12,
  },
  inbox: {
    height: SPACING.xl_72,
    width: '50%',
    paddingLeft: SPACING.l_32,
  },
  myReward: {
    width: '50%',
    height: SPACING.xl_72,
  },
  overlayHeader: {
    position: 'absolute',
    width: perWidth(100),
    height: perHeight(100),
  },
  containerWrap: {
    borderRadius: 12,
    backgroundColor: COLORS.backgroundWhite10,
    marginBottom: 8
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: resWidth(40),
    paddingVertical: resWidth(18),
  },
  label: {
    marginLeft: SPACING.m_16,
    flex: 1,
    fontFamily: 'Roboto',
    fontSize: resFont(14),
    fontWeight: '400',
    lineHeight: resWidth(16),
    color: COLORS.white,
  },
  txtPoint: {
    paddingRight: SPACING.s_4,
    color: COLORS.white,
    fontFamily: 'Roboto',
    fontWeight: '600',
    fontSize: resFont(14),
    lineHeight: resWidth(16),
  },
  sperateVertical: {
    paddingHorizontal: SPACING.s_8,
    color: COLORS.white,
  },
});

export default styles;
