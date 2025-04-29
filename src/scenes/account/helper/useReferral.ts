import { useState, useCallback } from 'react';
import { Share } from 'react-native';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import appsFlyer from 'react-native-appsflyer';
import config from 'react-native-config';
import { useAppSelector, useAppDispatch } from 'storeConfig/hook';
import { AccountSelector } from 'scenes/account/redux/slice';
import { AuthSelector } from 'scenes/auth/redux/slice';
import { isValidResponse } from 'utils/Utility';
import useToast from 'components/Toast/useToast';
import API_GLOBAL from 'constant/apiConstant';

export const useReferral = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const token = useAppSelector(AuthSelector.getToken);
  const referralCode = useAppSelector(AccountSelector.getRefCode);
  const idAuth = useAppSelector(AccountSelector.getIdAuth);
  const { addToast } = useToast();
  
  const generateReferralLink = useCallback(() => {
    const baseUrl = config.APP_DOWNLOAD_URL || 'https://yourapp.com/download';
    return `${baseUrl}?ref=${referralCode}`;
  }, [referralCode]);
  
  const shareReferralLink = useCallback(async () => {
    try {
      appsFlyer.setAppInviteOneLinkID('UrXm', null);
      appsFlyer.generateInviteLink(
        {
          channel: 'app_share',
          campaign: 'referral_program',
          customerID: idAuth,
          userParams: {
            af_refcode: referralCode
          }
        },
        (link) => {
          Share.share({
            message: `${link}`,
            url: link, 
          })
            .then(() => console.log("Share successful"))
            .catch(err => console.error("Share failed:", err));
        },
        (err) => console.error("Error generating link:", err)
      );
    } catch (error) {
      console.error('Error sharing referral link:', error);
      addToast({
        message: t('account.referralShareFailed'),
        position: 'top',
        type: 'ERROR_V3',
      });
    }
  }, [idAuth, referralCode, t, addToast]);


  const shareManualReferralLink = useCallback(async () => {
    try {
      const baseUrl = 'https://meetgo.onelink.me/UrXm';
      const params = new URLSearchParams({
        af_ios_url: 'https://meetgo.vn',
        af_xp: 'custom',
        pid: 'my_media_source',
        af_refcode: referralCode
      });
      const longUrl = `${baseUrl}?${params.toString()}`;
      Share.share({
        message: `${longUrl}`,
        url: longUrl, 
      })
        .then(() => console.log("Share successful"))
        .catch(err => console.error("Share failed:", err));
    } catch (error) {
      console.error('Error sharing referral link:', error);
      addToast({
        message: t('account.referralShareFailed'),
        position: 'top',
        type: 'ERROR_V3',
      });
    }
  }, [referralCode, t, addToast]);

  const fetchReferralList = useCallback(async () => {
    if (!idAuth || !token) return [];
    setLoading(true);
    try {
      const axiosInstance = axios.create({
        timeout: 10000,
        headers: { 'Authorization': token }
      });
      const response = await axiosInstance.post(API_GLOBAL.ACCOUNT.GET_REFERRAL_LIST);      
      if (response.status === 200 && response?.data?.data) {
        return response.data.data;
      } 
      if (response?.data?.status?.code === 400 && 
          response?.data?.status?.message === "Không tìm thấy dữ liệu!") {
        return [];
      }
      return [];
    } catch (error) {
      const errorMessage = error.message?.includes('Network Error') ? 
        t('account.referralLoadFailed') : 
        t('account.referralLoadFailed');
      addToast({
        message: errorMessage,
        position: 'top',
        type: 'ERROR_V3',
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [idAuth, token, t, addToast]);
  
  return {
    loading,
    fetchReferralList,
    shareManualReferralLink,
    shareReferralLink,
    generateReferralLink,
  };
};