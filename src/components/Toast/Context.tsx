import { createContext } from 'react';
import { IToastContextType } from './types';

const ToastContext = createContext({} as IToastContextType);

export default ToastContext;
