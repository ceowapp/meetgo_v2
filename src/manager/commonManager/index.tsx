import appConstant from 'constant/appConstant';
import SetupAxios from 'manager/axiosManager';
import React, {useState, FC, useLayoutEffect, useEffect} from 'react';
import {Alert, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import {AuthActions, AuthSelector} from 'scenes/auth/redux/slice';
import {IAuthToken} from 'scenes/auth/redux/types';
import {settingsActions, SettingsSelector} from 'services/settings/slice';
import {useAppDispatch, useAppSelector} from 'storeConfig/hook';
import {COLORS} from 'utils/styleGuide';
import Platform from 'utils/Platform';

const CommonManager: FC<{children: any}> = ({children}) => {
  const url = useAppSelector(SettingsSelector.getUrl);
  const [severPath, setSeverPath] = useState(url);
  const [mode, setMode] = useState<'develop' | 'custom' | 'production'>(
    'develop',
  );
  const token = useAppSelector(AuthSelector.getToken);
  const showSeverBoard = !url && (Platform.isDev || Platform.isBuildTest);
  const dispatch = useAppDispatch();
  const [isInitialized, setIsInitialized] = useState(false);

  const updateToken = (dataToken: IAuthToken) => {
    dispatch(AuthActions.updateCoupleToken(dataToken));
  };
  
  const reLogin = () => {
    Alert.alert('Phiên đăng nhập hết hạn');
    dispatch(AuthActions.logoutApp());
  };

  useEffect(() => {
    if (url) {
      setSeverPath(url);
    }
  }, [url]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        SetupAxios.init();
        SetupAxios.setupOnResponseInterceptors(updateToken, reLogin);
        if (token !== '') {
          SetupAxios.setHeaderToken(token);
        }
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        Alert.alert('Error', 'Failed to initialize app. Please try again.');
      }
    };

    initializeApp();
  }, [token]);

  useLayoutEffect(() => {
    if (isInitialized && url) {
      try {
        const newUrl = SetupAxios.setBaseUrl(url);
        if (newUrl !== url) {
          dispatch(settingsActions.setUrl(newUrl));
        }
        SplashScreen.hide();
      } catch (error) {
        console.error('Error setting up base URL:', error);
      }
    }
  }, [url, isInitialized]);

  const confirmSever = () => {
    if (!severPath) {
      return Alert.alert('Chọn sever');
    }
    dispatch(settingsActions.setUrl(severPath));
  };

  const renderSelectSever = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          alignContent: 'center',
          backgroundColor: COLORS.grey5,
          justifyContent: 'center',
        }}>
        <View
          style={{
            padding: 20,
            borderRadius: 10,
            backgroundColor: COLORS.greenSuccess,
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {mode !== 'custom' && <Text>URL: {severPath}</Text>}
          {mode === 'custom' && (
            <TextInput
              label="Url custom"
              mode="flat"
              value={severPath}
              style={{marginBottom: 10}}
              onChangeText={text => setSeverPath(text)}
            />
          )}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingVertical: 12,
            }}>
            <Button
              mode="contained-tonal"
              onPress={() => {
                setMode('develop');
                setSeverPath(appConstant.API_URL.DEVELOP);
              }}>
              <Text>Env Dev</Text>
            </Button>
            <Button
              mode="contained-tonal"
              onPress={() => {
                setMode('custom');
              }}>
              <Text>Env Custom</Text>
            </Button>
            <Button
              mode="contained-tonal"
              onPress={() => {
                setMode('production');
                setSeverPath(appConstant.API_URL.PRODUCTION);
              }}>
              <Text>Env Prod</Text>
            </Button>
          </View>
          <Button mode="contained" onPress={confirmSever}>
            <Text style={{color: 'white'}}>Xác nhận</Text>
          </Button>
        </View>
      </View>
    );
  };

  return showSeverBoard ? renderSelectSever() : children;
};

export default CommonManager;