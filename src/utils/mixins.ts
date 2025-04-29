// eslint-disable-next-line react-native/split-platform-components
import {ShadowStyleIOS} from 'react-native';
import SPACING from './spacing';
import {COLORS} from './styleGuide';

interface RectObjectType {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export function rectObject(
  top = 0,
  right = 0,
  bottom = 0,
  left = 0,
): RectObjectType {
  return {
    top,
    right,
    bottom,
    left,
  };
}

function dimensions(
  top = 0,
  right = 0,
  bottom = 0,
  left = 0,
  property: string,
) {
  const styles: Record<string, number> = {};

  styles[`${property}Top`] = top;
  styles[`${property}Right`] = right;
  styles[`${property}Bottom`] = bottom;
  styles[`${property}Left`] = left;

  return styles;
}

export function margin(
  top = 0,
  right = 0,
  bottom = 0,
  left = 0,
): Record<string, number> {
  return dimensions(top, right, bottom, left, 'margin');
}

export function padding(
  top = 0,
  right = 0,
  bottom = 0,
  left = 0,
): Record<string, number> {
  return dimensions(top, right, bottom, left, 'padding');
}
type ShadowType = 'low' | 'medium' | 'sharp';
interface ShadowStyle extends ShadowStyleIOS {
  elevation?: number;
}

export function shadow(type?: ShadowType, hasElevation = true): ShadowStyle {
  switch (type) {
    case 'low':
      return {
        shadowOpacity: 0.1,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowColor: COLORS.primaryBlack,
        shadowRadius: 6,
        elevation: hasElevation ? 24 : 0,
      };
    case 'medium':
      return {
        shadowOpacity: 0.2,
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowColor: COLORS.primaryBlack,
        shadowRadius: 24,
        elevation: hasElevation ? 14 : 0,
      };
    case 'sharp':
    default:
      return {
        shadowOpacity: 1,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowColor: COLORS.primaryBlack,
        shadowRadius: 1,
        elevation: hasElevation ? 4 : 0,
      };
  }
}
export function hitSlop(value = SPACING.s_12): RectObjectType {
  return rectObject(value, value, value, value);
}
export function hexToRGB(hex: string, alpha?: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r},${g},${b},${alpha || 1})`;
}
