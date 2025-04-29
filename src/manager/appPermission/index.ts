import {
  check,
  PERMISSIONS,
  request,
  RESULTS,
  IOSPermission,
  AndroidPermission,
  requestNotifications,
  PermissionStatus,
} from 'react-native-permissions';
import {Platform} from 'react-native';
import PlatformApp from 'utils/Platform';

const PLATFORM_LOCATION_PERMISSION = {
  ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
};

const ATT_PERMISSION = {
  ios: PERMISSIONS.IOS.APP_TRACKING_TRANSPARENCY,
};

const CAMERA_PERMISSION = {
  ios: PERMISSIONS.IOS.CAMERA,
  android: PERMISSIONS.ANDROID.CAMERA,
};

const REQUEST_PERMISSION_TYPE = {
  location: PLATFORM_LOCATION_PERMISSION,
  att: ATT_PERMISSION,
  camera: CAMERA_PERMISSION,
};

const PERMISSION_TYPE = {
  location: 'location',
  att: 'att',
  camera: 'camera',
};

class AppPermission {
  checkPermission = async (
    type: keyof typeof PERMISSION_TYPE,
  ): Promise<PermissionStatus> => {
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
    if (!permissions) {
      return RESULTS.UNAVAILABLE;
    }
    try {
      const result = await check(permissions);
      if (PlatformApp.isAndroid) {
        if (result === RESULTS.GRANTED || result === RESULTS.BLOCKED)
          return result;
        return await request(permissions);
      }
      return result;
    } catch (e) {
      return RESULTS.UNAVAILABLE;
    }
  };

  requestPermission = async (
    type: keyof typeof PERMISSION_TYPE,
  ): Promise<PermissionStatus> => {
    const permissions = REQUEST_PERMISSION_TYPE[type][Platform.OS];
    if (!permissions) {
      return RESULTS.UNAVAILABLE;
    }
    try {
      const result = await request(permissions);
      return result;
    } catch (e) {
      return RESULTS.UNAVAILABLE;
    }
  };

  requestNotifyPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      return true;
    }
    const {status} = await requestNotifications(['alert', 'sound', 'badge']);
    return status === RESULTS.GRANTED;
  };
}

const Permission = new AppPermission();
export {Permission, PERMISSION_TYPE};
