import AsyncStorage from '@react-native-async-storage/async-storage';
import Container from 'components/Container';
import React, {useState} from 'react';
import {Alert, View} from 'react-native';
import {Button, Text} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {SettingsSelector} from 'services/settings/slice';
import {useAppDispatch, useAppSelector} from 'storeConfig/hook';
import {RESET_ALL_STATE} from 'storeConfig/types';
import {COLORS, SPACING} from 'utils/styleGuide';

const ConfigBoard = () => {
  const [showBoard, setShowBoard] = useState(false);
  const dispatch = useAppDispatch();
  const url = useAppSelector(SettingsSelector.getUrl);
  const toggleBoard = () => setShowBoard(!showBoard);

  const resetApp = async () => {
    await AsyncStorage.clear();
    dispatch(RESET_ALL_STATE());
    setShowBoard(false);
  };
  const onPressReset = (): void => {
    if (url) {
      Alert.alert(
        'Reset app',
        'Bạn có muốn reset app',
        [
          {
            text: 'Yes',
            onPress: resetApp,
          },
          {
            text: 'No',
            onPress: () => {},
          },
        ],
        {cancelable: true},
      );
    }
  };
  const renderBoard = () => (
    <View
      style={{backgroundColor: COLORS.backdrop, padding: 24, borderRadius: 12}}>
      <Text style={{color: 'white'}}>Sever api: {url}</Text>
      <Button mode="elevated" onPress={onPressReset}>
        <Text>Reset app</Text>
      </Button>
    </View>
  );
  return (
    <Container
      edges={['top']}
      style={{
        position: 'absolute',
        zIndex: 9999,
        alignItems: 'center',
        alignSelf: 'center',
        backgroundColor: COLORS.transparent,
      }}>
      <Icon
        name="alert-box-outline"
        onPress={toggleBoard}
        size={SPACING.l_24}
      />
      {showBoard ? renderBoard() : null}
    </Container>
  );
};
export default ConfigBoard;
