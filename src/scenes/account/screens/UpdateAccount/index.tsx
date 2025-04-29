import React, {useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {RadioButton, Text} from 'react-native-paper';
import useAccount from 'scenes/account/helper/useAccount';
import {AccountSelector} from 'scenes/account/redux/slice';
import {useAppSelector} from 'storeConfig/hook';
import Screen, {perWidth, resFont, resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import InputNormal from 'components/Input/InputNormal';
import InputDateTime from 'components/Input/InputDateTime';
import moment from 'moment';
import {goBack} from 'navigation/RootNavigation';
import {validNumber, validateEmail} from 'utils/Utility';
import LinearGradient from 'react-native-linear-gradient';
import CommonHeader from 'components/CommonHeader';
import Container from 'components/Container';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {shadow} from 'utils/mixins';
import {ButtonPrimary} from 'components/Button/Primary';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    paddingBottom: SPACING.m_16,
  },
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
  txt: {
    fontFamily: 'Roboto',
    fontSize: resFont(14),
    fontWeight: '400',
    lineHeight: resWidth(16),
    color: COLORS.white,
  },
});
const UpdateAccount = () => {
  const { t } = useTranslation();
  const userInfo = useAppSelector(AccountSelector.getUserInfo);
  const {top} = useSafeAreaInsets();
  const [firstname, setFirstName] = useState(userInfo?.firstname || '');
  const [lastname, setLastName] = useState(userInfo?.lastname || '');
  const [birthday, setBirthday] = useState<Date>(
    userInfo?.birthday
      ? moment(userInfo.birthday, 'DD-MM-YYYY').toDate()
      : new Date(),
  );
  const [phone, setPhone] = useState(userInfo?.mobilenumber || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [address, setAddress] = useState(userInfo?.address || '');
  const [gender, setGender] = useState(userInfo?.gender || '');
  const idAuth = useAppSelector(AccountSelector.getIdAuth);

  const {loading, updateUserInfo, getUserInfo} = useAccount();
  const scrollRef = useRef();

  const onUpdateSuccess = () => {
    goBack();
    getUserInfo();
  };
  const onPressLater = () => {
    if (
      validateFirstName() ||
      validateLastName() ||
      validPhoneNumber() ||
      validEmail()
    ) {
      return;
    }
    if (idAuth) {
      const dataPayload = {
        idAuth,
        firstname,
        lastname,
        mobilenumber: phone,
        email,
        address,
        gender,
        birthday: moment(birthday).format('DD-MM-YYYY'),
      };
      updateUserInfo(dataPayload, onUpdateSuccess);
    }
  };

  const validateFirstName = () => {
    return firstname.trim().length < 1;
  };

  const validateLastName = () => {
    return lastname.trim().length < 1;
  };

  const validPhoneNumber = () => {
    return !validNumber(phone);
  };

  const validEmail = () => {
    return !validateEmail(email);
  };
  const contentInfo = (
    <View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <InputNormal
          mode="flat"
          label={t('account.inputLabelFirstName')}
          value={firstname}
          placeholder={t('account.inputPlaceholderFirstName')}
          onChangeText={setFirstName}
          onValidate={validateFirstName}
          errorMess={t('account.inputErrorFirstName')}
          containerInputStyle={{
            maxWidth: perWidth(40),
            minWidth: perWidth(40),
          }}
          textColor={COLORS.white}
          activeUnderlineColor={COLORS.white}
          activeOutlineColor={COLORS.white}
          underlineStyle={{
            height: 0,
          }}
          style={styles.input}
        />
        <InputNormal
          mode="flat"
          label={t('account.inputLabelLastName')}
          value={lastname}
          placeholder={t('account.inputPlaceholderLastName')}
          onChangeText={setLastName}
          onValidate={validateLastName}
          errorMess={t('account.inputErrorLastName')}
          containerInputStyle={{
            maxWidth: perWidth(40),
            minWidth: perWidth(40),
          }}
          textColor={COLORS.white}
          activeUnderlineColor={COLORS.white}
          activeOutlineColor={COLORS.white}
          underlineStyle={{
            height: 0,
          }}
          style={styles.input}
        />
      </View>
      <InputNormal
        mode="flat"
        value={phone}
        placeholder={t('account.inputPlaceholderPhonenumber')}
        onChangeText={setPhone}
        onValidate={validPhoneNumber}
        errorMess={t('account.inputErrorPhonenumber')}
        icon="phone"
        maxLength={10}
        keyboardType="numeric"
        textColor={COLORS.white}
        activeUnderlineColor={COLORS.white}
        activeOutlineColor={COLORS.white}
        underlineStyle={{
          height: 0,
        }}
        style={[styles.input, {marginTop: SPACING.m_16}]}
      />
      <InputNormal
        mode="flat"
        value={email}
        placeholder={t('account.inputPlaceholderEmail')}
        onChangeText={setEmail}
        errorMess={t('account.inputErrorEmail')}
        onValidate={validEmail}
        icon="email"
        keyboardType="email-address"
        textColor={COLORS.white}
        activeUnderlineColor={COLORS.white}
        activeOutlineColor={COLORS.white}
        underlineStyle={{
          height: 0,
        }}
        style={[styles.input, {marginTop: SPACING.m_16}]}
      />
      <InputNormal
        mode="flat"
        value={address}
        placeholder={t('account.inputPlaceholderAddress')}
        onChangeText={setAddress}
        icon="card-text"
        textColor={COLORS.white}
        activeUnderlineColor={COLORS.white}
        activeOutlineColor={COLORS.white}
        underlineStyle={{
          height: 0,
        }}
        style={[styles.input, {marginTop: SPACING.m_16}]}
      />
      <InputDateTime
        textInputProps={{
          icon: 'calendar-account',
          textColor: COLORS.white,
          activeOutlineColor: COLORS.white,
          activeUnderlineColor: COLORS.white,
          underlineStyle: {
            height: 0,
          },
          style: [styles.input, {marginVertical: SPACING.m_16}],
          mode: 'flat',
        }}
        datePickerProps={{
          mode: 'date',
          title: t('account.inputTitleYearborn'),
          confirmText: t('account.inputConfirmTextYearborn'),
          cancelText: t('account.inputCancelTextYearborn'),
          maximumDate: new Date(),
          dateValue: birthday,
        }}
        onChangeValue={setBirthday}
      />
      <RadioButton.Group onValueChange={setGender} value={gender}>
        <View style={{flexDirection: 'row'}}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: SPACING.m_16,
            }}>
            <Text style={styles.txt}>{t('account.radioMaleOption')}</Text>
            <RadioButton.Android value="male" color="white" />
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingLeft: SPACING.l_24,
            }}>
            <Text style={styles.txt}>{t('account.radioFemaleOption')}</Text>
            <RadioButton.Android value="female" />
          </View>
        </View>
      </RadioButton.Group>
      <ButtonPrimary
        content={t('account.updateAction')}
        containerStyle={{
          borderRadius: SPACING.s_8,
          marginTop: SPACING.m_16,
          maxWidth: resWidth(230),
          borderWidth: 1,
          borderColor: COLORS.white,
          alignSelf: 'center',
        }}
        isLoading={loading}
        disabled={loading}
        onPress={onPressLater}
      />
    </View>
  );
  return (
    <LinearGradient {...Screen.linearBackground} style={{flex: 1}}>
      <Container edges={['bottom']}>
        <CommonHeader
          title={t('account.updateAccount')}
          containerStyle={[
            styles.header,
            {
              height: top + resWidth(44),
            },
          ]}
        />
        <KeyboardAwareScrollView
          innerRef={scrollRef.current}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: SPACING.l_24,
            // backgroundColor: COLORS.grey6,
            flex: 1,
          }}>
          {contentInfo}
        </KeyboardAwareScrollView>
      </Container>
    </LinearGradient>
  );
};
export default UpdateAccount;
