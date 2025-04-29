import moment from 'moment';
import React, {FC} from 'react';
import {View} from 'react-native';
import {Text} from 'react-native-paper';
import {COLORS} from 'utils/styleGuide';
import {clockify, useCountdown} from 'utils/Utility';

type ICountDown = {
  timeStamp: number;
  onCountDownSuccess: () => void;
};
const CountDown: FC<ICountDown> = ({timeStamp, onCountDownSuccess}) => {
  const timeCountDown = moment.unix(timeStamp).toString();
  const secondsRemaining = useCountdown(timeCountDown, onCountDownSuccess);
  const {displayMinutes, displaySecs} = clockify(secondsRemaining);

  return (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text variant="titleLarge" style={{color: COLORS.white}}>
        {displayMinutes}: {displaySecs}
      </Text>
    </View>
  );
};

export default CountDown;
