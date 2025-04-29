import React from 'react';
import {AppState, AppStateStatus} from 'react-native';
import {useAppDispatch} from 'storeConfig/hook';
import Platform from 'utils/Platform';
import {appStateActions} from './slice';

const stateEvent = Platform.isAndroid ? 'focus' : 'change';

const AppStateHanlder = (): React.ReactElement => {
  const dispatch = useAppDispatch();
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    console.log('nextAppState', nextAppState);
    if (nextAppState) {
      dispatch(appStateActions.updateAppState(nextAppState));
    }
  };

  React.useEffect(() => {
    const subscription = AppState.addEventListener(
      stateEvent,
      handleAppStateChange,
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  return <></>;
};

export default AppStateHanlder;
