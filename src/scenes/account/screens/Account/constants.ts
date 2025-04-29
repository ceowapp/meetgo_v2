import { STACK_NAVIGATOR } from 'navigation/types';
import Images from 'utils/Images';
import { useTranslation } from 'react-i18next';

export const useAccountMenu = () => {
  const { t } = useTranslation();
  return [
    {
      label: t('account.meetHistory'),
      route: STACK_NAVIGATOR.HISTORY_MEET,
      icon: Images.icon.account.iconHistoryMeet,
    },
    {
      label: t('account.earningHistory'),
      route: STACK_NAVIGATOR.HISTORY_EARN,
      icon: Images.icon.account.iconHistoryEarn,
    },
    {
      label: t('account.transactionHistory'),
      route: STACK_NAVIGATOR.HISTORY_POINT,
      icon: Images.icon.account.iconHistoryMeet,
    },
    {
      label: t('account.guideline'),
      route: STACK_NAVIGATOR.WEB_VIEW,
      icon: Images.icon.account.iconPolicy,
      url: 'https://meetgo.vn/huong-dan-su-dung',
    },
    {
      label: t('account.privacyPolicy'),
      route: STACK_NAVIGATOR.WEB_VIEW,
      icon: Images.icon.account.iconSecurity,
      url: 'https://meetgo.vn/chinh-sach-bao-mat',
    },
    {
      label: t('account.termsAndConditions'),
      route: STACK_NAVIGATOR.WEB_VIEW,
      icon: Images.icon.account.iconPolicy,
      url: 'https://meetgo.vn/chinh-sach-quy-dinh-chung',
      hasDivider: true,
    },
    {
      label: t('account.manageAccount'),
      route: STACK_NAVIGATOR.MANAGE_ACC,
      icon: Images.icon.account.iconManageAcc,
    },
    {
      label: t('account.yourReferralList'),
      route: STACK_NAVIGATOR.REFERRAL_LIST,
      icon: Images.icon.account.iconReferral,
    },
    {
      label: t('account.languageSetting'),
      route: STACK_NAVIGATOR.LANGUAGE_SETTING,
      icon: Images.icon.account.iconLanguage,
    },
  ];
};


