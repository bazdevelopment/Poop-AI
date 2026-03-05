import * as DeviceInfo from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { storeMobileDeviceToken } from '@/api/push-notifications/push-notifications.requests';
import Toast from '@/components/toast';

import { translate, useSelectedLanguage } from '@/lib/i18n';
import Env from '../../env';

export function usePushNotificationToken() {
  const { language } = useSelectedLanguage();
  const storeDeviceInfo = async () => {
    try {
      const projectId = Env.EXPO_PUBLIC_EAS_PROJECT_ID as string;
      if (!projectId) {
        Toast.error(translate('alerts.projectIdNotFound'));
        return;
      }

      const token = await getDeviceToken(projectId);
      if (!token) {
        throw new Error('Failed to retrieve push token');
      }

      const response = await storeMobileDeviceToken({
        deviceToken: token,
        platform: Platform.OS,
        version: Env.EXPO_PUBLIC_VERSION,
        deviceModel: DeviceInfo.modelName || '',
        deviceBrand: DeviceInfo.brand || '',
        language,
      });

      if (response.success) {
        console.log('---- Device info stored successfully ----');
      }
    } catch (error) {
      console.error('Error storing device info:', error);
    }
  };

  const getDeviceToken = async (projectId: string) => {
    try {
      const { data: token } = await Notifications.getExpoPushTokenAsync({
        projectId,
      });

      if (!token) {
        throw new Error('Push token is undefined');
      }
      return token;
    } catch (error) {
      console.error('Error getting device token:', error);
      return null;
    }
  };

  return { storeDeviceInfo, getDeviceToken };
}
