import {IResponseType} from 'constant/commonType';
import moment from 'moment';
import {useRef, useEffect, useState} from 'react';
import {AppState, AppStateStatus, InteractionManager} from 'react-native';
import {showLocation} from 'react-native-map-link';

export function useDidUpdate(callback: () => void, deps: unknown[]): void {
  const hasMount = useRef(false);

  useEffect(() => {
    if (hasMount.current) {
      callback?.();
    } else {
      hasMount.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
export const sleep = (second: number): Promise<unknown> => {
  return new Promise((resolve: any) => setTimeout(resolve, second));
};

export const isValidResponse = (data: IResponseType<any>) => {
  if (data?.status?.code === 200 || data?.isSuccess) return true;
  return false;
};

export const validNumber = (val: string) => /^[0-9]\d*$/.test(val);
export const validateEmail = (email: string) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
};

export const openMapApp = async (
  latitude: number,
  longitude: number,
): Promise<void> => {
  try {
    await showLocation({
      latitude,
      longitude,
      alwaysIncludeGoogle: true,
      googleForceLatLon: true,
      appsWhiteList: ['google-maps'],
    });
  } catch (e) {
    console.error('openMap e', e);
  }
};

export function useEffectAfterTransition(
  expensiveTask: () => void,
  deps: unknown[],
): void {
  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      expensiveTask();
    });
    return () => task.cancel();
  }, deps);
}

export const useCountdown = (
  untilDate: string,
  callback: () => void,
): number => {
  const remaining = moment(untilDate).diff(moment(), 'seconds');
  const [secondsLeft, setSecondsLeft] = useState<number>(remaining);
  const handleStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      setSecondsLeft(moment(untilDate).diff(moment(), 'seconds'));
    }
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleStateChange);
    const interval = setInterval(() => {
      setSecondsLeft((secs: number) => {
        if (secs <= 0) {
          callback();
          clearInterval(interval);
          return 0;
        }
        return secs - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    setSecondsLeft(remaining);
  }, [untilDate]);

  return secondsLeft;
};

export const clockify = (
  secondsLeft: number,
): {
  displayHours: string;
  displayMinutes: string;
  displaySecs: string;
} => {
  const hours = Math.floor(secondsLeft / 60 / 60);
  const minutes = Math.floor((secondsLeft / 60) % 60);
  const seconds = Math.floor(secondsLeft % 60);
  const displayHours = hours < 10 ? `0${hours}` : hours;
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const displaySecs = seconds < 10 ? `0${seconds}` : seconds;
  return {
    displayHours: displayHours.toString(),
    displayMinutes: displayMinutes.toString(),
    displaySecs: displaySecs.toString(),
  };
};

export const calculatePercentMeet = (totalOfMeet: number) => {
  switch (true) {
    case totalOfMeet > 400:
      return 100;
    case totalOfMeet > 300:
      return 90;
    case totalOfMeet > 200:
      return 80;
    case totalOfMeet > 100:
      return 70;
    case totalOfMeet > 0:
      return 60;
    default:
      return 0;
  }
};

export const usePrevious = <T>(value: T): T | undefined => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
