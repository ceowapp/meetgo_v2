import {debounce} from 'lodash';
import React, {FC, useCallback, useEffect, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {Searchbar} from 'react-native-paper';
import {shadow} from 'utils/mixins';
import {resWidth} from 'utils/Screen';
import {COLORS, SPACING} from 'utils/styleGuide';
import { useTranslation } from 'react-i18next';

type IProps = {
  onSearch: (val: string) => void;
};
const HeaderSearch: FC<IProps> = ({onSearch}) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState<string>('');

  const debounceOnChangeSearch = useCallback(
    debounce(() => {
      onSearch(search);
    }, 500),
    [search],
  );

  useEffect(() => {
    if (search.length >= 2) {
      debounceOnChangeSearch();
    }
  }, [search]);

  const onChangeText = (val: string) => {
    setSearch(val);
    if (val.length === 0) {
      debounceOnChangeSearch?.cancel();
    }
  };

  const onSubmitSearch = () => {
    if (search.length > 3) {
      debounceOnChangeSearch();
      Keyboard.dismiss();
    }
  };
  return (
    <Searchbar
      placeholder={t('location.search')}
      inputStyle={{
        color: COLORS.white,
      }}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitSearch}
      value={search}
      placeholderTextColor={COLORS.white}
      iconColor={COLORS.white}
      style={{
        backgroundColor: COLORS.backgroundWhite10,
        margin: SPACING.m_16,
        marginTop: resWidth(38),
        borderRadius: 10,
        ...shadow(),
      }}
    />
  );
};
export default HeaderSearch;
