import React, {useEffect, useState} from 'react';
import database, {FirebaseDatabaseTypes} from '@react-native-firebase/database';
import DeviceInfo from 'react-native-device-info';
import Platform from 'utils/Platform';
import {hideModal, showDialogModal} from 'services/globalModal/modalHandler';
import {Linking, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-paper';
import appConstant from 'constant/appConstant';
import {COLORS, SPACING} from 'utils/styleGuide';
import {resWidth} from 'utils/Screen';
const ForceUpdateApp = () => {
  const [shouldUpdate, setShouldUpdate] = useState<boolean>(false);

  const handleOpenStore = async () => {
    if (Platform.isIos) {
      await Linking.openURL(appConstant.APP_STORE_LINK);
    } else {
      await Linking.openURL(appConstant.PLAY_STORE_LINK);
    }
  };

  useEffect(() => {
    if (!shouldUpdate) return hideModal();
  }, [shouldUpdate]);

  const handleShowUpdateModal = () => {
    showDialogModal({
      content: () => (
        <View
          style={{
            backgroundColor: COLORS.white,
            padding: resWidth(14),
            borderRadius: SPACING.s_8,
          }}>
          <Text variant="labelLarge" style={{paddingBottom: resWidth(14)}}>
            Cập nhật ứng dụng
          </Text>
          <View style={{height: resWidth(97), justifyContent: 'space-between'}}>
            <Text variant="labelMedium">
              Vui lòng cập nhật ứng dụng để tiếp tục sử dụng
            </Text>
            <TouchableOpacity onPress={handleOpenStore}>
              <Text
                style={{
                  color: COLORS.primary,
                  fontWeight: 'bold',
                  alignSelf: 'flex-end',
                }}>
                Cập nhật
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ),
    });
  };
  useEffect(() => {
    const reference = '/ForceApp/ForceFlag';
    const onForceFlagChange = database()
      .ref(reference)
      .on('value', (snapshot: FirebaseDatabaseTypes.DataSnapshot) => {
        if (snapshot.exists()) {
          const flag = snapshot.val();
          const {ref} = snapshot;
          if (flag) {
            setShouldUpdate(true);
            // eslint-disable-next-line no-void
            void ref.parent?.once(
              'value',
              (versionSnapshot: FirebaseDatabaseTypes.DataSnapshot) => {
                const versions = versionSnapshot.val();
                if (Platform.isIos) {
                  if (versions.iOS > parseInt(DeviceInfo.getBuildNumber())) {
                    handleShowUpdateModal();
                  }
                } else if (
                  versions.Android > parseInt(DeviceInfo.getBuildNumber())
                ) {
                  handleShowUpdateModal();
                }
              },
            );
          } else {
            setShouldUpdate(false);
          }
        }
      });
    return () => database().ref(reference).off('value', onForceFlagChange);
  }, []);
  return null;
};
export default ForceUpdateApp;
