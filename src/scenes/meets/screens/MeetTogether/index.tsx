import {
  RouteProp,
  useIsFocused,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import CommonHeader from 'components/CommonHeader';
import Container from 'components/Container';
import LottieView from 'lottie-react-native';
import {AppStackParamList} from 'navigation/types';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Text} from 'react-native-paper';
import {useKeepAwake} from '@sayem314/react-native-keep-awake';
import {AccountSelector} from 'scenes/account/redux/slice';
import {useAppSelector} from 'storeConfig/hook';
import Images from 'utils/Images';
import Screen, {perWidth, resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import CircleAvatar from './CircleAvatar';
import database from '@react-native-firebase/database';
import {AuthSelector} from 'scenes/auth/redux/slice';
import {isEmpty} from 'lodash';
import {IDataListenMeet} from './types';
import {IStatusMeet} from 'constant/commonType';
import CountDown from './CountDown';
import {useMeet} from 'scenes/meets/helper/useMeet';
import {hideModal, showDialogModal} from 'services/globalModal/modalHandler';
import WarningDialog from './WarningDialog';
import useToast from 'components/Toast/useToast';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {calculatePercentMeet} from 'utils/Utility';
import moment from 'moment';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ProgressiveImage} from 'components/Image/ProgressiveImage';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    paddingBottom: SPACING.m_16,
  },
});
const MeetTogether = () => {
  useKeepAwake();
  const { t } = useTranslation();
  const myAvatar = useAppSelector(AccountSelector.getAvatar);
  const account = useAppSelector(AuthSelector.getAccount);
  const navigation = useNavigation();
  const {addToast} = useToast();
  const {sendPendingSuccess, confimEndMeeting} = useMeet();
  const {top} = useSafeAreaInsets();
  const [dataConnect, setDataConnect] = useState<IDataListenMeet>();
  const [finishMeet, setFinishMeet] = useState<boolean>(false);
  const isConfirmBackRef = useRef(false);
  const {params} = useRoute<RouteProp<AppStackParamList, 'CONNECT_TOGETHER'>>();
  const {connectId} = params || {};
  const isFocus = useIsFocused();
  const avatarMeeter =
    account === dataConnect?.accountInvite
      ? dataConnect?.imageAccountInvited
      : dataConnect?.imageAccountInvite;
  const nameMeeter =
    account === dataConnect?.accountInvite
      ? `${dataConnect?.firstnameAccountInvited} ${dataConnect?.lastnameAccountInvited}`
      : `${dataConnect?.firstnameAccountInvite} ${dataConnect?.lastnameAccountInvite}`;
  useEffect(() => {
    const meetingPath = `Meeting/${account}/history/${connectId}`;
    const reference = database().ref(meetingPath);
    reference.on('value', snapShot => {
      if (snapShot.exists() && !isEmpty(snapShot.val())) {
        setDataConnect(snapShot.val());
      }
    });
  }, [connectId]);

  useEffect(() => {
    // check current countdown when user leave app along time
    if (dataConnect && dataConnect?.countdownTime > 0) {
      const timeCountDown = moment.unix(dataConnect?.countdownTime).toString();
      const currentDateCountDown = new Date(timeCountDown);
      if (currentDateCountDown < new Date()) {
        isConfirmBackRef.current = true;
        setFinishMeet(true);
      }
    }
  }, [isFocus, dataConnect]);

  useEffect(() => {
    navigation.addListener('beforeRemove', e => {
      if (!isConfirmBackRef.current) {
        onWarningBack();
        e.preventDefault();
      } else {
        navigation.dispatch(e.data.action);
        hideModal();
      }
    });
  }, [finishMeet, navigation, isConfirmBackRef]);

  useEffect(() => {
    if (
      dataConnect?.statusMeet === IStatusMeet.INVITED_REJECT ||
      dataConnect?.statusMeet === IStatusMeet.INVITE_REJECT
    ) {
      onFinishBack();
    }
  }, [dataConnect?.statusMeet]);

  const onCountDownSuccess = () => {
    setFinishMeet(true);
    isConfirmBackRef.current = true;
    sendPendingSuccess({connectId, account});
  };

  const onFinishBack = async () => {
    isConfirmBackRef.current = true;
    onConfirmEndMeeting();
    navigation.goBack();
  };

  const onContinue = () => hideModal();
  const onWarningBack = () => {
    showDialogModal({
      content: () => (
        <WarningDialog
          onContinue={onContinue}
          onExit={onFinishBack}
          title={t('meets.warning_exit_title')}
          description={t('meets.warning_exit_description')}
        />
      ),
    });
  };

  const onConfirmEndMeeting = async () => {
    const isResult = await confimEndMeeting({connectId, account});
    if (!isResult) {
      addToast({
        message: t('meets.error_end_meeting'),
        type: 'ERROR_V3',
        position: 'top',
      });
    }
    return isResult;
  };

  const bottomContent = () => {
    if (finishMeet) {
      const subContent = t('meets.note_final_result');
      return (
        <Text
          style={{
            color: COLORS.white,
            textAlign: 'center',
            fontStyle: 'italic',
          }}>
          {subContent}
        </Text>
      );
    }
    if (dataConnect?.statusMeet === IStatusMeet.READY) {
      return (
        <View
          style={{
            padding: SPACING.m_16,
          }}>
          <Text
            style={{
              fontFamily: 'Roboto',
              fontSize: resFont(20),
              fontWeight: '700',
              color: COLORS.white,
              textAlign: 'center',
              fontStyle: 'italic',
            }}>
            {t('meets.advice_quality_meet')}
          </Text>
        </View>
      );
    }
    return <></>;
  };

  const animateByState = () => {
    return (
      <ProgressiveImage
        source={Images.meet.meetTogether}
        resizeMode="contain"
        style={{width: perWidth(50), aspectRatio: 1}}
      />
    );
  };

  const renderHeader = () => {
    const actionBack = finishMeet ? onFinishBack : onWarningBack;
    return (
      <CommonHeader
        title={t('meets.connect_meet')}
        onPressBtnDefaultLeft={actionBack}
        containerStyle={[
          styles.header,
          {
            height: top + resWidth(44),
          },
        ]}
      />
    );
  };

  const renderMessageMeetSuccess = () => {
    const content = t('meets.congratulations');
    return (
      <Text
        variant="titleMedium"
        style={{
          textAlign: 'center',
          color: COLORS.white,
          paddingBottom: SPACING.m_16,
        }}>
        {content}
      </Text>
    );
  };

  const renderNFTAddress = () => (
    <View
      style={{
        alignItems: 'center',
        marginVertical: SPACING.s_8,
        padding: SPACING.s_12,
        borderRadius: SPACING.s_6,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Icon name="map-marker" size={SPACING.l_24} color={COLORS.white} />
        <Text style={{color: COLORS.white, textAlign: 'center'}}>
          Meet Location
        </Text>
      </View>
      <Text
        numberOfLines={2}
        style={{color: COLORS.white, textAlign: 'center'}}>
        {dataConnect?.address}
      </Text>
      <Text
        numberOfLines={2}
        style={{
          color: COLORS.white,
          textAlign: 'center',
          paddingTop: SPACING.s_6,
        }}>
        Tỉ lệ nhận thưởng:{' '}
        {dataConnect && dataConnect.totalOfMeet
          ? calculatePercentMeet(dataConnect.totalOfMeet)
          : 0}
        %
      </Text>
    </View>
  );

  const renderCountDownTime = () => {
    if (
      dataConnect?.statusMeet === IStatusMeet.READY &&
      dataConnect.countdownTime > 0 &&
      !finishMeet
    ) {
      return (
        <CountDown
          timeStamp={dataConnect.countdownTime}
          onCountDownSuccess={onCountDownSuccess}
        />
      );
    } else if (dataConnect?.statusMeet === IStatusMeet.PENDING) {
      return (
        <View style={{flex: 1, alignItems: 'center'}}>
          <LottieView
            loop
            autoPlay
            source={Images.animation.waitingTime}
            style={{width: perWidth(20), aspectRatio: 1}}
          />
        </View>
      );
    } else if (
      dataConnect?.statusMeet === IStatusMeet.PENDING_SUCCESS ||
      finishMeet
    ) {
      return (
        <LottieView
          loop={true}
          autoPlay
          source={Images.animation.success}
          style={{width: perWidth(25), aspectRatio: 1}}
        />
      );
    }
    return <></>;
  };
  return (
    <LinearGradient {...Screen.linearBackground} style={{flex: 1}}>
      <Container edges={['bottom']}>
        {renderHeader()}
        <View style={{alignItems: 'center', padding: SPACING.l_24}}>
          {(dataConnect?.statusMeet === IStatusMeet.PENDING_SUCCESS ||
            finishMeet) &&
            renderMessageMeetSuccess()}
          <View
            style={{
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-between',
            }}>
            <CircleAvatar url={myAvatar} />
            {renderCountDownTime()}
            <CircleAvatar url={avatarMeeter} />
          </View>
          {renderNFTAddress()}
          {animateByState()}
          {bottomContent()}
        </View>
      </Container>
    </LinearGradient>
  );
};
export default MeetTogether;
