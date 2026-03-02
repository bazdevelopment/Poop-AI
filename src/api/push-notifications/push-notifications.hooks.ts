import type { AxiosError } from 'axios';
import type {
  IGlobalNotificationsResponse,
  IMarkNotificationAsReadResponse,
} from './push-notification.interface';

import { createMutation, createQuery } from 'react-query-kit';
import Toast from '@/components/toast';

import { useCrashlytics } from '@/hooks/use-crashlytics';
import { translate } from '@/lib/i18n';
import { queryClient } from '../../../../exfit-ai/src/api/common';
import {
  getDeviceInfoByUniqueIdentifier,
  getUserNotifications,
  markNotificationAsRead,
  sendGlobalPushNotifications,
  sendIndividualPushNotification,
} from './push-notifications.requests';

type TVariables = {
  body: string;
  title: string;
  language: string;
};
type TVariablesIndividualNotification = {
  body: string;
  title: string;
  userId: string;
  language: string;
};

type TMarkNotificationAsRead = { notificationId: string; language: string };

type TUniqueIdentifierPayload = {
  deviceUniqueId: string;
  language: string;
};

export function useSendGlobalPushNotifications() {
  const { logEvent, recordError } = useCrashlytics();

  return createMutation<IGlobalNotificationsResponse, TVariables, AxiosError>({
    mutationFn: (variables) => sendGlobalPushNotifications(variables),
    onSuccess: () => {
      Toast.success(translate('alerts.globalPushNotificationSuccess'));
      logEvent('Successfully sent global push notification');
    },
    onError: (error) => {
      Toast.error(error.message);
      logEvent('Failure when sending global push notification', 'error');
      recordError(error, 'Failure when sending global push notification');
    },
  })();
}

export function useSendIndividualPushNotification() {
  const { logEvent, recordError } = useCrashlytics();

  return createMutation<
    IGlobalNotificationsResponse,
    TVariablesIndividualNotification,
    AxiosError
  >({
    mutationFn: (variables) => sendIndividualPushNotification(variables),
    onSuccess: () => {
      Toast.success(translate('alerts.individualPushNotificationSuccess'));
      logEvent('Successfully sent individual push notification');
    },
    onError: (error) => {
      Toast.error(error.message);
      logEvent('Failure when sending individual push notification', 'error');
      recordError(error, 'Failure when sending individual push notification');
    },
  })();
}

export function useFetchUserNotifications(variables: {
  userId: string;
  language: string;
}) {
  return createQuery<any, TUniqueIdentifierPayload, AxiosError>({
    queryKey: ['individual-user-notifications', variables.userId],
    fetcher: () => getUserNotifications(variables),
    enabled: !!variables.userId,
  });
}

export function useDeviceInfoByUniqueIdentifier(
  variables: TUniqueIdentifierPayload,
) {
  return createQuery<any, TUniqueIdentifierPayload, AxiosError>({
    queryKey: ['device-info-by-unique-identifier', variables.deviceUniqueId],
    fetcher: () =>
      getDeviceInfoByUniqueIdentifier(
        variables.deviceUniqueId,
        variables.language,
      ),
  });
}

export function useMarkNotificationAsRead() {
  const { logEvent, recordError } = useCrashlytics();
  return createMutation<
    IMarkNotificationAsReadResponse,
    TMarkNotificationAsRead,
    AxiosError
  >({
    mutationFn: (variables) => markNotificationAsRead(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['individual-user-notifications'],
      });

      logEvent('Notification has been marked as read successfully');
    },
    onError: (error) => {
      Toast.error(error.message);
      logEvent('Failure when notification is mark as read', 'error');
      recordError(error, 'Failure when notification is mark as read');
    },
  })();
}
