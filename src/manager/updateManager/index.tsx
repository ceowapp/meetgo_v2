import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Dimensions, AppState, AppStateStatus} from 'react-native';
import * as Updates from 'expo-updates';
/** utils */
import {usePrevious} from 'utils/Utility';
import {perWidth, resFont, resWidth} from 'utils/Screen';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useValue,
  timing,
  EasingNode,
} from 'react-native-reanimated';

import Svg, {Line} from 'react-native-svg';
import {COLORS, SPACING} from 'utils/styleGuide';

enum UpdateMode {
  NONE = 'NONE',
  STORE = 'STORE',
  UPDATE = 'UPDATE',
  RATE_LIMIT = 'RATE_LIMIT',
}

interface Props {
  appState: string;
}

interface InitState {
  isVisible: boolean;
  updateMode: typeof UpdateMode[keyof typeof UpdateMode];
  updateDescription: string;
  currentProgress: number;
  statusProcess: string;
  isUpdate: boolean;
}

const initState: InitState = {
  isVisible: false,
  updateMode: UpdateMode.NONE,
  updateDescription: '',
  currentProgress: 0,
  statusProcess: 'Đang cập nhật',
  isUpdate: false,
};

const STROKE_COLOR = COLORS.green;

const {width} = Dimensions.get('window');

const AnimatedCircle = Animated.createAnimatedComponent(Line);

const styles = StyleSheet.create({
  container: {
    width: perWidth(100),
    top: -110,
    backgroundColor: COLORS.bgBurn,
    position: 'absolute',
    zIndex: 999,
    paddingVertical: SPACING.l_24,
    paddingHorizontal: SPACING.s_12,
  },
  progressText: {
    color: 'rgba(256,256,256,0.7)',
    textAlign: 'center',
  },
});

const UpdateManager: React.FC = () => {
  const [state, setState] = useState<InitState>(initState);
  const [appState, setAppState] = useState<AppStateStatus>();
  const translateY = useValue(0);
  const lastUpdateMode = usePrevious(state.updateMode);
  const lastAppState = usePrevious(appState);
  const updateObject = useRef<Updates.UpdateCheckResult | null>(null);

  const checkForUpdate = async () => {
    try {
      console.log('------- Expo Updates check for Update -------');
      const update = await Updates.checkForUpdateAsync();
      updateObject.current = update;
      console.log('checkForUpdate', update);
      
      if (!update.isAvailable) {
        console.log('------- Expo Updates have no Update -------');
        setState({...state, updateMode: UpdateMode.NONE});
        return;
      }

      console.log('------- Expo Updates have an Update -------');
      setState({...state, updateMode: UpdateMode.UPDATE});
      
    } catch (error) {
      console.warn('Updates.checkForUpdateError', error);
      try {
        let errorMessage = '';
        if (typeof error === 'object' && error !== null) {
          errorMessage = error.message || JSON.stringify(error);
        } else {
          errorMessage = String(error);
        }
        if (errorMessage.includes('{') && errorMessage.includes('}')) {
          const jsonStart = errorMessage.indexOf('{');
          const jsonEnd = errorMessage.lastIndexOf('}') + 1;
          if (jsonStart >= 0 && jsonEnd > 0) {
            const jsonStr = errorMessage.substring(jsonStart, jsonEnd);
            const parseData = JSON.parse(jsonStr);
            if (parseData.statusCode === 429) {
              setState({
                ...state,
                updateMode: UpdateMode.RATE_LIMIT,
                statusProcess: parseData.message || 'Rate limit reached',
              });
              return;
            }
          }
        }
        setState({
          ...state,
          updateMode: UpdateMode.NONE,
          statusProcess: 'Update check failed',
        });
      } catch (parseError) {
        console.error('Error parsing Update error:', parseError);
        setState({
          ...state,
          updateMode: UpdateMode.NONE,
          statusProcess: 'Update check failed',
        });
      }
    }
  };

  const updateStatusDidChange = (status: string) => {
    console.log('------- Expo Updates updateStatusDidChange -------');
    let {statusProcess} = state;
    
    switch (status) {
      case 'checking':
        console.log('CHECKING_FOR_UPDATE');
        statusProcess = 'Kiểm tra bản cập nhật';
        break;
      case 'downloading':
        console.log('DOWNLOADING_PACKAGE');
        statusProcess = 'Đang tải';
        break;
      case 'installing':
        console.log('INSTALLING_UPDATE');
        statusProcess = 'Đang cài đặt bản cập nhật';
        break;
      case 'up-to-date':
        console.log('UP_TO_DATE');
        statusProcess = 'Đã cập nhật bản mới nhất';
        break;
      case 'installed':
        console.log('UPDATE_INSTALLED');
        statusProcess = 'Cập nhật hoàn tất';
        break;
      case 'error':
        console.log('UNKNOWN_ERROR');
        statusProcess = 'Cập nhật thất bại';
        break;
      default:
        break;
    }
    setState({...state, statusProcess});
  };

  const showUpdate = () => {
    timing(translateY, {
      toValue: 110,
      duration: 500,
      easing: EasingNode.inOut(EasingNode.ease),
    }).start();
  };

  const hideUpdate = () => {
    setTimeout(() => {
      timing(translateY, {
        toValue: -110,
        duration: 500,
        easing: EasingNode.inOut(EasingNode.ease),
      }).start();
    }, 1000);
  };

  const progress = useSharedValue(0);
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    console.log('nextAppState Update manager', nextAppState);
    if (nextAppState) {
      setAppState(nextAppState);
    }
  };
  
  useEffect(() => {
    void checkForUpdate();
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  useEffect(() => {
    if (
      lastAppState !== appState &&
      (lastAppState === 'background' || lastAppState === 'inactive') &&
      appState === 'active'
    ) {
      void checkForUpdate();
    }
  }, [appState]);

  async function handleUpdateManually() {
    try {
      updateStatusDidChange('downloading');
      
      // Simulate progress for better UX (Expo Updates doesn't provide progress)
      const progressInterval = setInterval(() => {
        progress.value = Math.min(progress.value + 0.05, 0.9);
      }, 300);
      
      await Updates.fetchUpdateAsync();
      clearInterval(progressInterval);
      
      updateStatusDidChange('installing');
      progress.value = 1;
      
      setTimeout(async () => {
        await Updates.reloadAsync();
      }, 1000);
      
    } catch (e) {
      console.log('handleUpdateManually error', e);
      updateStatusDidChange('error');
      progress.value = 0;
    }
  }

  useEffect(() => {
    const {updateMode} = state;
    if (updateMode === UpdateMode.UPDATE && updateMode !== lastUpdateMode) {
      showUpdate();
      void handleUpdateManually();
    }
  }, [state]);

  useEffect(() => {
    if (progress.value === 1) {
      hideUpdate();
    }
  }, [progress]);

  const containerStyles = StyleSheet.flatten([
    styles.container,
    {transform: [{translateY}]},
  ]);
  
  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: width - width * progress.value,
  }));
  
  const colorMessage =
    state.updateMode !== UpdateMode.RATE_LIMIT ? STROKE_COLOR : COLORS.error;
    
  return (
    <Animated.View style={containerStyles}>
      {state.updateMode !== UpdateMode.RATE_LIMIT && (
        <Animated.Text
          style={{
            color: 'white',
            fontFamily: 'Roboto',
            fontSize: resFont(14),
            lineHeight: resWidth(16),
          }}>
          Ứng dụng đang cập nhật phiên bản mới, vui lòng chờ đến khi hoàn thành
        </Animated.Text>
      )}
      <Animated.Text style={{textAlign: 'center', color: colorMessage}}>
        {state.statusProcess}
      </Animated.Text>
      <Svg>
        <AnimatedCircle
          x1="0"
          y1="10"
          x2={perWidth(100)}
          y2="10"
          stroke={STROKE_COLOR}
          strokeWidth={10}
          strokeDasharray={perWidth(100)}
          animatedProps={animatedProps}
          strokeLinecap={'square'}
        />
      </Svg>
    </Animated.View>
  );
};

export default UpdateManager;