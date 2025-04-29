const API_GLOBAL = {
  AUTH: {
    REGISTER: '/v1/user/register',
    REFRESH_TOKEN: '/v1/user/refreshToken',
    UPDATE_INFO_FIRST: '/v1/user/updateInfoFirst',
  },
  ACCOUNT: {
    GET_INFO: '/v1/user/getInfo',
    UPDATE_INFO: '/v1/user/updateInfo',
    UPDATE_AVATAR: 'v1/user/updateAvatar',
    DELETE_ACCOUNT: 'v1/user/deleteAccount',
    GET_REFERRAL_LIST: 'v1/user/getReferralList'
  },
  VERIFY_ACCOUNT: {
    GET_INFO_KYC: 'v1/user/getInfoKYC',
    UPDATE_INFO_KYC: 'v1/user/updateInfoKYC',
    UPLOAD_IMG_FRONT_ID: 'v1/user/uploadImgFrontID',
    UPLOAD_IMG_BACK_ID: 'v1/user/uploadImgBackID',
    UPLOAD_IMG_KYC_WITH_ID: 'v1/user/uploadImgKycWithID',
    APPROVE_KYC: 'v1/user/approveKYC',
  },
  LOCATION: {
    NEAR_BY_ME: 'v1/location/nearbyMe',
    NEAR_BY_MAP: 'v1/location/nearbyMap',
    ADDRESS_DETAIL: 'v1/location/addressDetail',
    SEARCH: 'v1/location/search',
  },
  MEET: {
    INVITE_USER_OTHER: 'v1/meet/inviteUserOther',
    PENDING_SUCCESS: 'v1/meet/pendingSuccess',
    CONFIRM_END_MEETING: '/v1/meet/confirmEndMeeting',
    INVITED_USER_GET_INFO: '/v1/meet/invitedUserGetInfo',
    INVITED_SEND_CONFIRM: '/v1/meet/invitedSendConfirm',
    GET_LAST_MEETING: 'v1/meet/getLastMeeting',
    REJET_MEETING: 'v1/meet/rejectMeeting',
    NEAR_BY_ME: 'v1/meet/nearbyMe',
    HISTORY_MEET: 'v1/meet/historyMeet',
    CHECK_MEET_AGAIN: '/v1/meet/checkMeetAgain',
  },
  HISTORY: {
    TRANSFER_MEETPOINT: '/v1/point/historyTransferMeetPoint',
  },
  EARN: {
    START_EARN: 'v1/earn/startEarn',
    CHECK_EARN: 'v1/earn/checkEarn',
    VERIFY_EARN: 'v1/earn/verifyEarn',
    HISTORY_EARN: 'v1/earn/historyEarn',
    GET_LAST_EARN: 'v1/earn/getLastEarn',
    CANCEL_EARN: 'v1/earn/cancelEarn',
  },
};
export default API_GLOBAL;
