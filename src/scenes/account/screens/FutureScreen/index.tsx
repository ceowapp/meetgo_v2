import React from 'react';
import SectionEmpty from 'scenes/meets/components/SectionEmpty';
import { useTranslation } from 'react-i18next';

const FutureScreen = () => {
  const { t } = useTranslation();
  return (
    <SectionEmpty message={t('account.featureUpdateWarning')} />
  );
};
export default FutureScreen;
