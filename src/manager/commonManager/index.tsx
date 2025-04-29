import appConstant from 'constant/appConstant';
import SetupAxios from 'manager/axiosManager';
import React, {useState, FC, useLayoutEffect} from 'react';
import {Alert, View} from 'react-native';
import {Button, Text, TextInput} from 'react-native-paper';
import SplashScreen from 'react-native-splash-screen';
import {AuthActions, AuthSelector} from 'scenes/auth/redux/slice';
import {IAuthToken} from 'scenes/auth/redux/types';
import {settingsActions, SettingsSelector} from 'services/settings/slice';
import {useAppDispatch, useAppSelector} from 'storeConfig/hook';
import {COLORS} from 'utils/styleGuide';

const CommonManager: FC<{children: any}> = ({children}) => {
  const url = useAppSelector(SettingsSelector.getUrl);
  const [severPath, setSeverPath] = useState(url);
  const [mode, setMode] = useState<'develop' | 'custom' | 'production'>(
    'develop',
  );
  const token = useAppSelector(AuthSelector.getToken);
  const showSeverBoard = !url;
  const dispatch = useAppDispatch();

  const updateToken = (dataToken: IAuthToken) => {
    dispatch(AuthActions.updateCoupleToken(dataToken));
  };
  const reLogin = () => {
    Alert.alert('Phiên đăng nhập hết hạn');
    dispatch(AuthActions.logoutApp());
  };

  useLayoutEffect(() => {
    SplashScreen.hide();
    SetupAxios.init();
    SetupAxios.setupOnResponseInterceptors(updateToken, reLogin);
    if (token !== '') {
      SetupAxios.setHeaderToken(token);
    }
  }, [token]);
  useLayoutEffect(() => {
    const newUrl = SetupAxios.setBaseUrl(url);
    if (newUrl !== url) {
      dispatch(settingsActions.setUrl(newUrl));
    }
  }, [url]);

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
          // paddingHorizontal: 20,
        }}>
        <View
          style={{
            padding: 20,
            borderRadius: 10,
            backgroundColor: COLORS.greenSuccess,
            width: '100%',
            alignItems: 'center',
            // height: '20%',
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
              // width: '100%',
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
