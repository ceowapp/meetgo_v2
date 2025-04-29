import React, {useEffect, useState, useRef} from 'react';
import {StyleSheet, Dimensions, AppState, AppStateStatus} from 'react-native';
import CodePush, {
  DownloadProgress,
  RemotePackage,
} from 'react-native-code-push';
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
  CODE_PUSH = 'CODE_PUSH',
  RATE_LIMIT = 'RATE_LIMIT',
}

interface Props {
  appState: string;
}

interface InitState {
  isVisible: boolean;
  updateMode: typeof UpdateMode[keyof typeof UpdateMode];
  codePushDescription: string;
  currentProgress: number;
  statusProcess: string;
  isUpdate: boolean;
}

const initState: InitState = {
  isVisible: false,
  updateMode: UpdateMode.NONE,
  codePushDescription: '',
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
  const remotePackage = useRef<RemotePackage | null>(null);

  const checkCodePush = async () => {
    try {
      console.log('------- CodePush check for Update -------');
      const update = await CodePush.checkForUpdate();
      remotePackage.current = update;
      console.log('checkCodePush', update);
      if (!update) {
        console.log('------- CodePush have no Update -------');
        setState({...state, updateMode: UpdateMode.NONE});
        return;
      }

      console.log('------- CodePush have a Update -------');
      const {isMandatory} = update;
      if (isMandatory) {
        setState({...state, updateMode: UpdateMode.CODE_PUSH});
      } else if (update.failedInstall) {
        const local = await update.download();
        if (local) {
          await local.install(CodePush.InstallMode.ON_NEXT_RESUME);
        }
      } else {
        CodePush.disallowRestart();
        await CodePush.sync({
          installMode: CodePush.InstallMode.ON_NEXT_RESUME,
          mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
        });
        CodePush.allowRestart();
      }
    } catch (error) {
      console.warn('CodePush.checkForUpdateError', error);
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
        console.error('Error parsing CodePush error:', parseError);
        setState({
          ...state,
          updateMode: UpdateMode.NONE,
          statusProcess: 'Update check failed',
        });
      }
    }
  }

  const codePushStatusDidChange = (syncStatus: CodePush.SyncStatus) => {
    console.log('------- CodePush codePushStatusDidChange -------');
    let {statusProcess} = state;
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log('CHECKING_FOR_UPDATE');
        statusProcess = 'Kiểm tra bản cập nhật';
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log('DOWNLOADING_PACKAGE');
        statusProcess = 'Đang tải';
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        console.log('AWAITING_USER_ACTION');
        statusProcess = 'Chờ hành động';
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        console.log('INSTALLING_UPDATE');
        statusProcess = 'Đang cài đặt bản cập nhật';
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        console.log('UP_TO_DATE');
        statusProcess = 'Đã cập nhật bản mới nhất';
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        console.log('UPDATE_INSTALLED');
        statusProcess = 'Cập nhật hoàn tất';
        break;
      case CodePush.SyncStatus.SYNC_IN_PROGRESS:
        console.log('SYNC_IN_PROGRESS');
        break;
      case CodePush.SyncStatus.UNKNOWN_ERROR:
        console.log('UNKNOWN_ERROR');
        break;
      default:
        break;
    }
    setState({...state, statusProcess});
  };

  const codePushDownloadDidProgress = (progressDownload: DownloadProgress) => {
    console.log('------- CodePush codePushDownloadDidProgress -------');
    const {receivedBytes, totalBytes} = progressDownload;
    const temp = receivedBytes / totalBytes;
    progress.value = temp;
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
    void checkCodePush();
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
      void checkCodePush();
    }
  }, [appState]);

  async function handleCodePushManually() {
    try {
      const localPackage = await remotePackage?.current?.download(
        codePushDownloadDidProgress,
      );
      if (localPackage) {
        await localPackage.install(CodePush.InstallMode.IMMEDIATE);
      }
    } catch (e) {
      console.log('handleCodePushManually', e);
    }
  }

  useEffect(() => {
    const {updateMode} = state;
    if (updateMode === UpdateMode.CODE_PUSH && updateMode !== lastUpdateMode) {
      showUpdate();
      if (remotePackage?.current?.failedInstall) {
        // eslint-disable-next-line no-void
        void handleCodePushManually();
      } else {
        runProgressCodepush();
      }
    }
  }, [state]);

  useEffect(() => {
    if (progress.value === 1) {
      hideUpdate();
    }
  }, [progress]);

  const runProgressCodepush = async () => {
    try {
      const codePushOptions = {
        installMode: CodePush.InstallMode.ON_NEXT_RESTART,
        mandatoryInstallMode: CodePush.InstallMode.IMMEDIATE,
      };
      CodePush.disallowRestart();
      await CodePush.sync(
        codePushOptions,
        codePushStatusDidChange,
        codePushDownloadDidProgress,
      );
      CodePush.allowRestart();
    } catch (error) {
      try {
        console.warn('CodePush sync error:', error);
        let errorMessage = '';
        if (typeof error === 'object' && error !== null && error.message) {
          errorMessage = error.message;
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
                statusProcess: parseData.message || 'cập nhật lỗi',
              });
              return;
            }
          }
        }
        setState({
          ...state,
          updateMode: UpdateMode.NONE,
          statusProcess: 'Cập nhật thất bại',
        });
      } catch (errorParse) {
        console.error('Error parsing CodePush error:', errorParse);
        setState({
          ...state,
          updateMode: UpdateMode.NONE,
          statusProcess: 'Cập nhật thất bại',
        });
      }
    }
  };

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

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  updateDialog: false,
};

export default CodePush(codePushOptions)(UpdateManager);
