import React, {useCallback, useState, PropsWithChildren} from 'react';

import Toast from '.';
import ToastContext from './Context';
import {ToastDataType} from './types';

export const ToastContextProvider: React.FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const [toast, setToast] = useState<ToastDataType>();

  const addToast = useCallback(
    (newToast: ToastDataType) => {
      setToast(newToast);
    },
    [setToast],
  );
  const hideToast = useCallback(() => {
    setToast(undefined);
  }, [setToast]);

  return (
    <ToastContext.Provider value={{addToast, hideToast}}>
      {children}
      {toast && (
        <Toast
          hideMyself={hideToast}
          type={toast.type}
          key={toast.message}
          animateDuration={toast.animateDuration}
          hideAfter={toast.hideAfter}
          position={toast.position}
          dynamicBottomPosition={toast.dynamicBottomPosition}
          stylesContainer={toast.stylesContainer}
          IconRight={toast.IconRight}
          IconLeft={toast.IconLeft}
          name={toast.name}
          onPressRight={toast.onPressRight}>
          {toast.message}
        </Toast>
      )}
    </ToastContext.Provider>
  );
};
