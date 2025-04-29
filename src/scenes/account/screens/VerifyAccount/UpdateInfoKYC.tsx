import {ButtonPrimary} from 'components/Button/Primary';
import Container from 'components/Container';
import InputDateTime from 'components/Input/InputDateTime';
import InputNormal from 'components/Input/InputNormal';
import moment from 'moment';
import React, {FC, useState} from 'react';
import useAccountKyc from 'scenes/account/helper/useAccountKyc';
import {IReqUpdateInfoKYC, IResInfoKyc} from 'scenes/account/redux/types';
import {resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import {validNumber} from 'utils/Utility';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {StyleSheet, View} from 'react-native';
import {shadow} from 'utils/mixins';
import {useTranslation} from 'react-i18next';

type IProps = {
  onNextPage: () => void;
  infoKyc?: IResInfoKyc;
};
const styles = StyleSheet.create({
  input: {
    backgroundColor: COLORS.backgroundWhite10,
    borderTopLeftRadius: resWidth(10),
    borderTopRightRadius: resWidth(10),
    borderRadius: resWidth(10),
    shadowOpacity: 1,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowColor: COLORS.backgroundBlack30,
    shadowRadius: 3,
    ...shadow(),
  },
});
const UpdateInfoKYC: FC<IProps> = ({onNextPage, infoKyc}) => {
  const {t} = useTranslation();
  const [fullname, setFullName] = useState<string>(infoKyc?.fullname || '');
  const [birthday, setBirthday] = useState<Date>(
    infoKyc?.birthday
      ? moment(infoKyc.birthday, 'DD-MM-YYYY').toDate()
      : new Date(),
  );
  const [idday, setIdDay] = useState<Date>(
    infoKyc?.idday ? moment(infoKyc.idday, 'DD-MM-YYYY').toDate() : new Date(),
  );
  const [idnumber, setIdNumber] = useState<string>(
    infoKyc?.idnumber?.toString() || '',
  );
  const [idplace, setIdPlace] = useState<string>(infoKyc?.idplace || '');
  const [isSubmit, setIsSubmit] = useState(false);
  const {updateInfoKyc, loading} = useAccountKyc();
  const callback = (status: {status: boolean}) => {
    if (status) {
      onNextPage();
    }
  };
  const onUpdateKyc = () => {
    setIsSubmit(true);
    if (validFullName(true) || validPlace(true) || validIdNumber(true)) {
      return;
    } else {
      const data: IReqUpdateInfoKYC = {
        idday: moment(idday).format('DD-MM-YYYY'),
        birthday: moment(birthday).format('DD-MM-YYYY'),
        fullname,
        idnumber,
        idplace,
      };
      updateInfoKyc(data, callback);
    }
  };

  const validIdNumber = (isValidate = false) => {
    if (isValidate && (idnumber.length !== 12 || !validNumber(idnumber))) {
      return true;
    }
    if (isSubmit && (idnumber.length !== 12 || !validNumber(idnumber))) {
      return true;
    } else if (idnumber && idnumber.length !== 12) {
      return true;
    }
    return false;
  };

  const validFullName = (isValidate = false) => {
    if (isValidate && fullname.length < 3) {
      return true;
    }
    if (isSubmit && fullname.length < 3) {
      return true;
    } else if (fullname && fullname.length < 3) {
      return true;
    }
    return false;
  };
  const validPlace = (isValidate = false) => {
    if (isValidate && idplace.length < 3) {
      return true;
    }
    if (isSubmit && idplace.length < 3) {
      return true;
    } else if (idplace && idplace.length < 3) {
      return true;
    }
    return false;
  };
  return (
    <>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        enableOnAndroid
        style={{
          flex: 1,
          borderRadius: SPACING.m_16,
          paddingTop: SPACING.s_12,
          paddingHorizontal: SPACING.s_12,
          backgroundColor: COLORS.backgroundWhite10,
        }}>
        <InputNormal
          value={fullname}
          placeholder={t('account.fullnamePlaceholder')}
          onChangeText={setFullName}
          onValidate={validFullName}
          errorMess={t('account.fullnameError')}
          icon="account"
          containerInputStyle={{
            width: '100%',
          }}
          mode="flat"
          textColor={COLORS.white}
          activeUnderlineColor={COLORS.white}
          activeOutlineColor={COLORS.white}
          underlineStyle={{
            height: 0,
          }}
          style={styles.input}
        />
        <View style={{paddingTop: SPACING.m_16}} />
        <InputDateTime
          textInputProps={{
            label: t('account.birthdayLabel'),
            icon: 'calendar-account',
            mode: 'flat',
            textColor: COLORS.white,
            activeUnderlineColor: COLORS.white,
            activeOutlineColor: COLORS.white,
            underlineStyle: {
              height: 0,
            },
            style: styles.input,
          }}
          datePickerProps={{
            mode: 'date',
            title: t('account.birthdayTitle'),
            confirmText: t('account.confirm'),
            cancelText: t('account.cancel'),
            maximumDate: new Date(),
            dateValue: birthday,
          }}
          onChangeValue={setBirthday}
        />
        <View style={{paddingTop: SPACING.m_16}} />
        <InputNormal
          value={idnumber}
          placeholder={t('account.idnumberPlaceholder')}
          onChangeText={setIdNumber}
          onValidate={validIdNumber}
          errorMess={t('account.idnumberError')}
          icon="card-bulleted-outline"
          containerInputStyle={{
            width: '100%',
          }}
          mode="flat"
          textColor={COLORS.white}
          activeUnderlineColor={COLORS.white}
          activeOutlineColor={COLORS.white}
          underlineStyle={{
            height: 0,
          }}
          maxLength={12}
          style={styles.input}
        />
        <View style={{paddingTop: SPACING.m_16}} />
        <InputDateTime
          textInputProps={{
            icon: 'calendar-clock',
            mode: 'flat',
            textColor: COLORS.white,
            activeUnderlineColor: COLORS.white,
            activeOutlineColor: COLORS.white,
            underlineStyle: {
              height: 0,
            },
            style: styles.input,
          }}
          datePickerProps={{
            mode: 'date',
            title: t('account.iddayTitle'),
            confirmText: t('account.confirm'),
            cancelText: t('account.cancel'),
            maximumDate: new Date(),
            dateValue: idday,
          }}
          onChangeValue={setIdDay}
        />
        <View style={{paddingTop: SPACING.m_16}} />
        <InputNormal
          value={idplace}
          placeholder={t('account.idplacePlaceholder')}
          onChangeText={setIdPlace}
          onValidate={validPlace}
          errorMess={t('account.idplaceError')}
          icon="card-text-outline"
          containerInputStyle={{
            width: '100%',
          }}
          mode="flat"
          textColor={COLORS.white}
          activeUnderlineColor={COLORS.white}
          activeOutlineColor={COLORS.white}
          underlineStyle={{
            height: 0,
          }}
          style={styles.input}
        />
      </KeyboardAwareScrollView>
      <ButtonPrimary
        content={t('account.submit')}
        onPress={onUpdateKyc}
        disabled={loading}
        isLoading={loading}
        containerStyle={{marginTop: SPACING.l_24}}
      />
    </>
  );
};
export default UpdateInfoKYC;
