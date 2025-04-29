import moment from 'moment';
import React, {FC, useState} from 'react';
import {TouchableOpacity, TextInputProps} from 'react-native';
import DatePicker, {DatePickerProps} from 'react-native-date-picker';
import InputNormal, {IInput} from './InputNormal';

type IPropsInputDateTime = {
  textInputProps: IInput;
  datePickerProps: Omit<DatePickerProps, 'date'> & {dateValue?: Date};
  onChangeValue: (value: Date) => void;
};
const InputDateTime: FC<IPropsInputDateTime> = ({
  onChangeValue,
  textInputProps,
  datePickerProps: {dateValue = new Date(), ...restPickerProps},
}) => {
  const [datePicker, setDatePicker] = useState(dateValue);
  const [open, setOpen] = useState(false);
  const openPicker = () => {
    setOpen(true);
  };
  const onConfirm = (dateChange: Date) => {
    setOpen(false);
    setDatePicker(dateChange);
    onChangeValue(dateChange);
  };
  const onClosePicker = () => setOpen(false);
  return (
    <TouchableOpacity onPress={openPicker}>
      <InputNormal
        {...textInputProps}
        editable={false}
        pointerEvents="none"
        value={moment(datePicker).format('DD-MM-YYYY')}
      />
      <DatePicker
        modal
        open={open}
        onConfirm={onConfirm}
        onCancel={onClosePicker}
        {...restPickerProps}
        date={datePicker}
        locale="vi"
      />
    </TouchableOpacity>
  );
};
export default InputDateTime;
