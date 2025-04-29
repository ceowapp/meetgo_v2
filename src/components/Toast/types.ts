import {ViewStyle} from 'react-native';

export type IToastType =
  | 'INFO'
  | 'ERROR'
  | 'SUCCESS'
  | 'SHARING'
  | 'ERROR_V3'
  | 'SUCCESS_V3'
  | 'INFO_V3'
  | 'UNDO';

export type ToastProps = {
  type?: IToastType;
  children: string;
  IconRight: React.ComponentType<never> | undefined;
  IconLeft?: React.ReactNode | undefined;
  animateDuration?: number;
  position: 'top' | 'bottom';
  dynamicBottomPosition?: number;
  hideAfter?: number;
  hideMyself: (msg: string) => void;
  stylesContainer?: ViewStyle;
  name?: string;
  onPressRight?: () => void;
  trackingParams?: any;
};

export interface IToastContextType {
  addToast: (_str: ToastDataType) => void;
  hideToast: () => void;
}

export type ToastDataType = {
  message: string;
  position: 'top' | 'bottom';
  type?: IToastType;
  IconRight?: React.ComponentType<never>;
  IconLeft?: React.ReactNode;
  dynamicBottomPosition?: number;
  animateDuration?: number;
  hideAfter?: number;
  stylesContainer?: ViewStyle;
  name?: string;
  onPressRight?: () => void;
};
