import {useContext} from 'react';
import ToastContext from './Context';
import {IToastContextType} from './types';

export default function useToast(): IToastContextType {
  return useContext(ToastContext);
}
