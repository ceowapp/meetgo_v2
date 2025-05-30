import React, {useEffect, useState, useRef, useCallback, Suspense} from 'react';
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
  withTiming,
  Easing,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import LoadingScreen from 'components/LoadingScreen';
import Svg, {Line} from 'react-native-svg';
import {COLORS, SPACING} from 'utils/styleGuide';
import { useTranslation } from 'react-i18next';

enum UpdateMode {
  NONE = 'NONE',
  STORE = 'STORE',
  CODE_PUSH = 'CODE_PUSH',
  RATE_LIMIT = 'RATE_LIMIT',
}

interface InitState {
  isVisible: boolean;
  updateMode: typeof UpdateMode[keyof typeof UpdateMode];
  codePushDescription: string;
  currentProgress: number;
  statusProcess: string;
  isUpdate: boolean;
  progressCompleted: boolean;
}

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
  }
});

const UpdateManager: React.FC = () => {
  const { t } = useTranslation();
  
  const initState: InitState = {
    isVisible: false,
    updateMode: UpdateMode.NONE,
    codePushDescription: '',
    currentProgress: 0,
    statusProcess: t('update.status_process_default'),
    isUpdate: false,
    progressCompleted: false,
  };
  
  const [state, setState] = useState<InitState>(initState);
  const [appState, setAppState] = useState<AppStateStatus | undefined>();
  const translateY = useSharedValue(-110);
  const progress = useSharedValue(0);
  const lastUpdateMode = usePrevious(state.updateMode);
  const lastAppState = usePrevious(appState);
  const remotePackage = useRef<RemotePackage | null>(null);

  const onProgressComplete = useCallback(() => {
    setState(prev => ({...prev, progressCompleted: true}));
  }, []);

  const checkCodePush = async () => {
    try {
      console.log('------- CodePush check for Update -------');
      const update = await CodePush.checkForUpdate();
      remotePackage.current = update;
      console.log('checkCodePush', update);
      if (!update) {
        console.log('------- CodePush have no Update -------');
        setState(prev => ({...prev, updateMode: UpdateMode.NONE}));
        return;
      }
      console.log('------- CodePush have a Update -------');
      const {isMandatory} = update;
      if (isMandatory) {
        setState(prev => ({...prev, updateMode: UpdateMode.CODE_PUSH, progressCompleted: false}));
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
      setState(prev => ({
        ...prev,
        updateMode: UpdateMode.NONE,
        statusProcess: t('update.status_process_default'),
      }));
    }
  };

  const codePushStatusDidChange = (syncStatus: CodePush.SyncStatus) => {
    console.log('------- CodePush codePushStatusDidChange -------');
    let statusProcess = '';
    switch (syncStatus) {
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
        console.log('CHECKING_FOR_UPDATE');
        statusProcess = t('update.status_process_checking');
        break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        console.log('DOWNLOADING_PACKAGE');
        statusProcess = t('update.status_process_downloading');
        break;
      case CodePush.SyncStatus.AWAITING_USER_ACTION:
        console.log('AWAITING_USER_ACTION');
        statusProcess = t('update.status_process_awaiting');
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        console.log('INSTALLING_UPDATE');
        statusProcess = t('update.status_process_installing');
        break;
      case CodePush.SyncStatus.UP_TO_DATE:
        console.log('UP_TO_DATE');
        statusProcess = t('update.status_process_up_to_date');
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        console.log('UPDATE_INSTALLED');
        statusProcess = t('update.status_process_update_installed');
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
    
    if (statusProcess) {
      setState(prev => ({...prev, statusProcess}));
    }
  };

  const codePushDownloadDidProgress = (progressDownload: DownloadProgress) => {
    console.log('------- CodePush codePushDownloadDidProgress -------');
    const {receivedBytes, totalBytes} = progressDownload;
    const temp = receivedBytes / totalBytes;
    if (temp >= 1) {
      progress.value = withTiming(1, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      }, () => {
        runOnJS(onProgressComplete)();
      });
    } else {
      progress.value = temp;
    }
  };

  const showUpdate = useCallback(() => {
    translateY.value = withTiming(110, {
      duration: 500,
      easing: Easing.inOut(Easing.ease),
    });
  }, [translateY]);

  const hideUpdate = useCallback(() => {
    setTimeout(() => {
      translateY.value = withTiming(-110, {
        duration: 500,
        easing: Easing.inOut(Easing.ease),
      });
    }, 1000);
  }, [translateY]);

  const handleAppStateChange = useCallback((nextAppState: AppStateStatus) => {
    console.log('nextAppState Update manager', nextAppState);
    setAppState(nextAppState);
  }, []);
  
  useEffect(() => {
    checkCodePush();
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
      lastAppState !== appState &&
      (lastAppState === 'background' || lastAppState === 'inactive') &&
      appState === 'active'
    ) {
      checkCodePush();
    }
  }, [appState, lastAppState]);

  const handleCodePushManually = useCallback(async () => {
    try {
      if (!remotePackage.current) return;
      const localPackage = await remotePackage.current.download(
        codePushDownloadDidProgress,
      );
      if (localPackage) {
        await localPackage.install(CodePush.InstallMode.IMMEDIATE);
      }
    } catch (e) {
      console.log('handleCodePushManually', e);
    }
  }, []);

  useEffect(() => {
    const {updateMode} = state;
    if (updateMode === UpdateMode.CODE_PUSH && updateMode !== lastUpdateMode) {
      showUpdate();
      if (remotePackage?.current?.failedInstall) {
        handleCodePushManually();
      } else {
        runProgressCodepush();
      }
    }
  }, [state.updateMode, lastUpdateMode, showUpdate, handleCodePushManually]);

  useEffect(() => {
    if (state.progressCompleted) {
      hideUpdate();
    }
  }, [state.progressCompleted, hideUpdate]);

  const runProgressCodepush = useCallback(async () => {
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
      console.error('CodePush sync error:', error);
      setState(prev => ({
        ...prev,
        updateMode: UpdateMode.NONE,
        statusProcess: t('update.status_process_default'),
      }));
    }
  }, [t]);

  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: translateY.value}],
    };
  });

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: width - width * progress.value,
  }));

  const colorMessage =
    state.updateMode !== UpdateMode.RATE_LIMIT ? STROKE_COLOR : COLORS.error;

  return (
    <Animated.View style={[styles.container, animatedContainerStyle]}>
      {state.updateMode !== UpdateMode.RATE_LIMIT && (
        <Animated.Text style={styles.updateText}>
          {t('update.progress_text')}
        </Animated.Text>
      )}
      <Animated.Text style={[styles.statusText, {color: colorMessage}]}>
        {state.statusProcess}
      </Animated.Text>
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

const codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.MANUAL,
  updateDialog: false,
};

const UpdateManagerWrapped = CodePush(codePushOptions)(UpdateManager);

const UpdateManagerWithSuspense = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <UpdateManagerWrapped />
    </Suspense>
  );
};

export default UpdateManagerWithSuspense;