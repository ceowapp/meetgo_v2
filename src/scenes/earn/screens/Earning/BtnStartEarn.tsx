import {ButtonPrimary} from 'components/Button/Primary';
import LottieView from 'lottie-react-native';
import React, {FC, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Text} from 'react-native-paper';
import useEarn from 'scenes/earn/helper/useEarn';
import {
  IDataEarn,
  IReqCurrentEarn,
  IReqCurrentShop,
} from 'scenes/earn/redux/types';
import {locationSelector} from 'services/location/slice';
import {useAppSelector} from 'storeConfig/hook';
import Images from 'utils/Images';
import {resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import CountDown from './CountDown';
import {useTranslation} from 'react-i18next';

const styles = StyleSheet.create({
  btnStart: {
    backgroundColor: COLORS.shopGreen,
    borderWidth: 1,
    borderColor: COLORS.white,
    width: resWidth(234),
    height: resWidth(44),
    borderRadius: resWidth(10),
    marginBottom: SPACING.l_32,
  },
  errorMessage: {
    textAlign: 'center',
    color: COLORS.pastelYellow,
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: resFont(16),
    lineHeight: resWidth(18),
    paddingBottom: SPACING.l_32,
  },
  txtDisable: {
    color: COLORS.grey2,
  },
  txt: {
    fontWeight: '700',
    fontFamily: 'Roboto',
    fontSize: resFont(14),
    lineHeight: resWidth(16),
    color: COLORS.white,
  },
  warningEarn: {
    fontStyle: 'italic',
    fontFamily: 'Roboto',
    fontWeight: '700',
    lineHeight: resWidth(16),
    textAlign: 'center',
    fontSize: resFont(12),
    color: COLORS.white,
  },
  txtMakeDone: {
    fontFamily: 'Roboto',
    fontWeight: '700',
    fontSize: resWidth(20),
    lineHeight: resWidth(24),
    color: COLORS.white,
    textAlign: 'center',
  },
  img: {
    width: resWidth(224),
    height: resWidth(180),
  },
});
type EarnProps = {
  locationID: string;
  onSetDataEarn: (data: IReqCurrentEarn & {makeDone: boolean}) => void;
  propsEarn?: IDataEarn;
};
let stopCountDown = false;
const BtnStartEarn: FC<EarnProps> = ({
  locationID,
  onSetDataEarn,
  propsEarn,
}) => {
  const {t} = useTranslation();
  const {startEarn, verifyEarn, checkEarn, loading, dataEarn, errorMessage} =
    useEarn(propsEarn);
  const [finish, setFinish] = useState<boolean>(false);
  const [makeDone, setMakeDone] = useState<boolean>(false);
  const currentLocation = useAppSelector(locationSelector.getCurentLocation);

  useEffect(() => {
    const payload = {
      earnID: dataEarn?.earnID || '',
      currentLat: currentLocation?.latitude || 0,
      currentLong: currentLocation?.longitude || 0,
      makeDone,
    };
    onSetDataEarn(payload);
  }, [dataEarn?.countdownTime]);

  useEffect(() => {
    if (dataEarn && dataEarn?.countdownTime > 0) {
      let payload: IReqCurrentEarn = {
        earnID: dataEarn?.earnID || '',
        currentLat: currentLocation?.latitude || 0,
        currentLong: currentLocation?.longitude || 0,
        // currentLat: 10.729877175074606,
        // currentLong: 106.62474381431971,
      };
      const interval = setInterval(() => {
        if (stopCountDown) {
          clearInterval(interval);
        } else {
          checkEarn(payload);
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [dataEarn?.countdownTime]);
  const onStart = () => {
    if (currentLocation) {
      const payload: IReqCurrentShop = {
        locationID,
        currentLat: currentLocation?.latitude,
        currentLong: currentLocation?.longitude,
      };
      startEarn(payload);
    }
  };

  const onDone = async () => {
    if (currentLocation) {
      const payload: IReqCurrentEarn = {
        earnID: dataEarn?.earnID || '',
        currentLat: currentLocation?.latitude,
        currentLong: currentLocation?.longitude,
      };
      const status = await verifyEarn(payload);
      setMakeDone(status);
      onSetDataEarn({...payload, makeDone: true});
    }
  };
  const disableButton =
    loading || (dataEarn && dataEarn?.countdownTime > 0 && !finish);
  const styleBtn = styles.btnStart;
  const txtBtn = disableButton
    ? StyleSheet.flatten([styles.txt, styles.txtDisable])
    : styles.txt;

  const onRenderErrorMessage = () => {
    if (errorMessage)
      return <Text style={styles.errorMessage}>{errorMessage}</Text>;
    return null;
  };

  const onCountDownSuccess = () => {
    stopCountDown = true;
    setFinish(true);
  };
  const titleEarn =
    dataEarn && dataEarn.countdownTime
      ? t('earn.done')
      : t('earn.start');
  const warningEarn =
    dataEarn && dataEarn.countdownTime
      ? t('earn.warning')
      : '';
  const congratSuccess = t('earn.success');
  const onActionEarn = !finish ? onStart : onDone;
  return (
    <>
      {makeDone ? (
        <>
          <Text style={styles.txtMakeDone}>{congratSuccess}</Text>
          <LottieView
            source={Images.animation.earnSuccess}
            loop
            autoPlay
            style={{width: resWidth(220), aspectRatio: 1}}
          />
        </>
      ) : (
        <>
          {dataEarn?.countdownTime && (
            <CountDown
              timeStamp={dataEarn?.countdownTime}
              onCountDownSuccess={onCountDownSuccess}
            />
          )}
          {onRenderErrorMessage()}
          <ButtonPrimary
            onPress={onActionEarn}
            disabled={disableButton}
            containerStyle={styleBtn}
            titleStyle={txtBtn}
            content={titleEarn}
          />
          {finish && <Text style={styles.warningEarn}>{warningEarn} </Text>}
        </>
      )}
      {!dataEarn?.countdownTime && (
        <FastImage
          source={Images.earn.background}
          resizeMode="contain"
          style={styles.img}
        />
      )}
    </>
  );
};
export default BtnStartEarn;
