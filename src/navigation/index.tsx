import React, {useCallback} from 'react';
import {AppStack} from './types';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import {useAppSelector} from 'storeConfig/hook';
import {AuthSelector} from 'scenes/auth/redux/slice';
import {SPACING} from 'utils/styleGuide';

export default function RootNavigation() {
  const accountUser = useAppSelector(AuthSelector.getAccount);
  const isFirstTimeRegister = useAppSelector(AuthSelector.getFirstTimeRegister);
  const renderStack = useCallback(() => {
    if (!isFirstTimeRegister || !accountUser) return AuthNavigator();
    return AppNavigator();
  }, [accountUser, isFirstTimeRegister]);

  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        headerLeftContainerStyle: {
          left: SPACING.s_12,
        },
      }}>
      {renderStack()}
    </AppStack.Navigator>
  );
}
