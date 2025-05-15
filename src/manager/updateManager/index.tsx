import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Dimensions, AppState, AppStateStatus, Text} from 'react-native';
import * as Updates from 'expo-updates';
import {usePrevious} from 'utils/Utility';
import {perWidth, resFont, resWidth} from 'utils/Screen';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, {Line} from 'react-native-svg';
import {COLORS, SPACING} from 'utils/styleGuide';

enum UpdateMode {
  NONE = 'NONE',
  STORE = 'STORE',
  UPDATE = 'UPDATE',
  RATE_LIMIT = 'RATE_LIMIT',
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

const AnimatedLine = Animated.createAnimatedComponent(Line);

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
  updateText: {
    color: 'white',
    fontFamily: 'Roboto',
    fontSize: resFont(14),
    lineHeight: resWidth(16),
  },
  statusText: {
    textAlign: 'center',
    marginVertical: 5,
  },
});

const UpdateManager: React.FC = () => {
  const [state, setState] = useState<InitState>(initState);
  const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);
  const translateY = useSharedValue(-110); // Start offscreen
  const lastUpdateMode = usePrevious(state.updateMode);
  const lastAppState = usePrevious(appState);
  const updateObject = useRef<any>(null);
  const [updatesEnabled, setUpdatesEnabled] = useState<boolean>(false);
  const progress = useSharedValue(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const initializeUpdates = async () => {
      try {
        if (!Updates || typeof Updates.checkForUpdateAsync !== 'function') {
          console.warn('Expo Updates module not properly initialized');
          setUpdatesEnabled(false);
          return;
        }
        setUpdatesEnabled(true);
        checkForUpdate().catch(err => 
          console.error('Initial update check failed:', err)
        );
      } catch (error) {
        console.error('Error initializing Expo Updates:', error);
        setUpdatesEnabled(false);
      }
    };
    initializeUpdates();
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const checkForUpdate = async () => {
    if (!updatesEnabled) return;
    try {
      console.log('------- Expo Updates check for Update -------');
      updateStatusDidChange('checking');
      const update = await Updates.checkForUpdateAsync();
      updateObject.current = update;
      console.log('checkForUpdate', update);
      if (!update.isAvailable) {
        console.log('------- Expo Updates have no Update -------');
        updateStatusDidChange('up-to-date');
        setState(prev => ({...prev, updateMode: UpdateMode.NONE}));
        return;
      }
      console.log('------- Expo Updates have an Update -------');
      setState(prev => ({...prev, updateMode: UpdateMode.UPDATE}));
    } catch (error) {
      console.warn('Updates.checkForUpdateError', error);
      handleUpdateError(error);
    }
  };

  const handleUpdateError = (error: any) => {
    try {
      let errorMessage = '';
      if (typeof error === 'object' && error !== null) {
        errorMessage = (error as Error).message || JSON.stringify(error);
      } else {
        errorMessage = String(error);
      }
      if (errorMessage.includes('{') && errorMessage.includes('}')) {
        const jsonStart = errorMessage.indexOf('{');
        const jsonEnd = errorMessage.lastIndexOf('}') + 1;
        if (jsonStart >= 0 && jsonEnd > 0) {
          try {
            const jsonStr = errorMessage.substring(jsonStart, jsonEnd);
            const parseData = JSON.parse(jsonStr);
            if (parseData.statusCode === 429) {
              setState(prev => ({
                ...prev,
                updateMode: UpdateMode.RATE_LIMIT,
                statusProcess: parseData.message || 'Rate limit reached',
              }));
              return;
            }
          } catch (jsonError) {
            console.error('Error parsing JSON from error message:', jsonError);
          }
        }
      }
      setState(prev => ({
        ...prev,
        updateMode: UpdateMode.NONE,
        statusProcess: 'Update check failed',
      }));
    } catch (parseError) {
      console.error('Error handling update error:', parseError);
      setState(prev => ({
        ...prev,
        updateMode: UpdateMode.NONE,
        statusProcess: 'Update check failed',
      }));
    }
  };

  const updateStatusDidChange = (status: string) => {
    console.log('------- Expo Updates updateStatusDidChange:', status, '-------');
    let statusProcess = state.statusProcess;
    
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
    
    setState(prevState => ({...prevState, statusProcess}));
  };

  const showUpdate = () => {
    translateY.value = withTiming(110, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const hideUpdate = () => {
    setTimeout(() => {
      translateY.value = withTiming(-110, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });
    }, 1000);
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    console.log('nextAppState Update manager', nextAppState);
    if (nextAppState) {
      setAppState(nextAppState);
    }
  };
  
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (
      updatesEnabled &&
      lastAppState !== appState &&
      (lastAppState === 'background' || lastAppState === 'inactive') &&
      appState === 'active'
    ) {
      checkForUpdate().catch(err => 
        console.error('Background update check failed:', err)
      );
    }
  }, [appState, updatesEnabled]);

  async function handleUpdateManually() {
    if (!updatesEnabled) return;
    try {
      updateStatusDidChange('downloading');
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      progress.value = 0;
      progressIntervalRef.current = setInterval(() => {
        progress.value = Math.min(progress.value + 0.05, 0.9);
      }, 300);
      await Updates.fetchUpdateAsync();
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      updateStatusDidChange('installing');
      progress.value = 1;
      setTimeout(async () => {
        try {
          await Updates.reloadAsync();
        } catch (reloadError) {
          console.error('Error reloading app:', reloadError);
          updateStatusDidChange('error');
        }
      }, 1000);
    } catch (e) {
      console.log('handleUpdateManually error', e);
      updateStatusDidChange('error');
      progress.value = 0;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    }
  }

  useEffect(() => {
    const {updateMode} = state;
    if (updatesEnabled && updateMode === UpdateMode.UPDATE && updateMode !== lastUpdateMode) {
      showUpdate();
      handleUpdateManually().catch(err => 
        console.error('Error handling update manually:', err)
      );
    }
  }, [state.updateMode, updatesEnabled]);

  useEffect(() => {
    if (progress.value === 1) {
      hideUpdate();
    }
  }, [progress.value]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: width - width * progress.value,
  }));
  
  const colorMessage =
    state.updateMode !== UpdateMode.RATE_LIMIT ? STROKE_COLOR : COLORS.error;
    
  if (!updatesEnabled) return null;

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          transform: [{ translateY: translateY }]
        }
      ]}
    >
      {state.updateMode !== UpdateMode.RATE_LIMIT && (
        <Text style={styles.updateText}>
          Ứng dụng đang cập nhật phiên bản mới, vui lòng chờ đến khi hoàn thành
        </Text>
      )}
      <Text style={[styles.statusText, {color: colorMessage}]}>
        {state.statusProcess}
      </Text>
      <Svg>
        <AnimatedLine
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