import type { AxiosError } from 'axios';
import type {
  CalendarStatusMap,
  ICreateLogRequestData,
  ICreateLogResponseData,
  IRequestCalendarActivity,
  IUpdateLogRequestData,
  IUpdateLogResponseData,
} from './activity-logs.types';

import { createMutation, createQuery } from 'react-query-kit';
import Toast from '@/components/toast';

import { translate } from '@/lib/i18n';
import { queryClient } from '../common';
import {
  createActivityLog,
  getCalendarActivity,
  updateActivityLog,
} from './activity-logs.requests';

export function useCreateActivityLog({ onSuccess }) {
  return createMutation<
    ICreateLogResponseData,
    ICreateLogRequestData,
    AxiosError
  >({
    mutationFn: (variables) => createActivityLog(variables),
    onSuccess: (data) => {
      onSuccess &&
        onSuccess({ xpReward: data.xpEarned, gemsReward: data.gemsEarned });
      queryClient.invalidateQueries({ queryKey: ['user-info'] });
      queryClient.invalidateQueries({
        queryKey: ['activity-logs'],
      });
    },
    onError: () => {
      Toast.error(translate('alerts.createActivityLogFailed'));
    },
  })();
}

export function useUpdateActivityLog() {
  return createMutation<
    IUpdateLogResponseData,
    IUpdateLogRequestData,
    AxiosError
  >({
    mutationFn: (variables) => updateActivityLog(variables),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['activity-logs'],
      });
      queryClient.invalidateQueries({ queryKey: ['user-info'] });
    },
    onError: () => {
      Toast.error(translate('alerts.updateActivityLogFailed'));
    },
  })();
}

export function useGetCalendarActivityLog(variables: IRequestCalendarActivity) {
  return createQuery<CalendarStatusMap, IRequestCalendarActivity, AxiosError>({
    queryKey: ['activity-logs', variables.startDate, variables.endDate],
    fetcher: () => getCalendarActivity(variables),
  })();
}
