import React, {useCallback, useEffect} from 'react';
import {AuthSelector} from 'scenes/auth/redux/slice';
import {useAppSelector} from 'storeConfig/hook';
import database from '@react-native-firebase/database';
import {isEmpty} from 'lodash';
import {
  hideModal,
  modalRef,
  showEarnModal,
  showMeetModal,
} from 'services/globalModal/modalHandler';
import {useFocusEffect} from '@react-navigation/native';
import useAccount from 'scenes/account/helper/useAccount';

import {useMeet} from 'scenes/meets/helper/useMeet';
import InviteDialog from './InviteDialog';
import useEarn from 'scenes/earn/helper/useEarn';
import EarningDialog from './EarningDialog';
import {navigateScreen} from 'navigation/RootNavigation';
import {STACK_NAVIGATOR} from 'navigation/types';

const HandlerModal = () => {
  const {getInfoInvite, getLastMeeting} = useMeet();
  const {getLastEarn, dataEarn} = useEarn();
  const {getUserInfo} = useAccount();
  useFocusEffect(
    useCallback(() => {
      getUserInfo();
      getLastEarn();
    }, []),
  );
  const account = useAppSelector(AuthSelector.getAccount);
  const handleInviteFromMeeter = async () => {
    const result = await getInfoInvite();
    if (result) {
      showMeetModal({
        content: () => <InviteDialog dataInvite={result} />,
      });
    }
  };

  useEffect(() => {
    if (dataEarn) {
      showEarnModal({
        content: () => <EarningDialog dataEarn={dataEarn} />,
      });
    }
  }, [dataEarn]);

  const handleAutoJoinMeeter = async () => {
    const result = await getLastMeeting();
    if (result?.connectId) {
      navigateScreen(STACK_NAVIGATOR.MEET_TOGETHER, {
        connectId: result.connectId,
      });
    }
  };

  useEffect(() => {
    handleAutoJoinMeeter();
  }, []);
  useEffect(() => {
    if (account) {
      const meetingPath = `Meeting/${account}/listenChange`;
      const reference = database().ref(meetingPath);
      reference.on('value', snapShot => {
        if (snapShot.exists() && !isEmpty(snapShot.val())) {
          handleInviteFromMeeter();
        } else {
          const currentModalName = modalRef.current?.getModalName();
          // hide meet when inviter is cancel meet and current dialog show is meet_dialog
          if (currentModalName === 'DIALOG_MEET_MODAL') {
            console.tron.log('hidemodal');
            hideModal();
          }
        }
      });
    }
  }, [account]);
  return <></>;
};

export default HandlerModal;
