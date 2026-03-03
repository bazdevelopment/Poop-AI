import type {
  CalendarStatusMap,
  ICreateLogRequestData,
  ICreateLogResponseData,
  IRequestCalendarActivity,
  IUpdateLogRequestData,
  IUpdateLogResponseData,
} from './activity-logs.types';

import { firebaseCloudFunctionsInstance } from 'firebase/config';

/** Crete activity log */
export async function createActivityLog(
  logData: ICreateLogRequestData,
): Promise<ICreateLogResponseData> {
  try {
    const { data } =
      await firebaseCloudFunctionsInstance.httpsCallable('createActivityLog')(
        logData,
      );

    return data as ICreateLogResponseData;
  } catch (error) {
    throw error;
  }
}

/** Get calendar activity log */
export async function getCalendarActivity(
  payload: IRequestCalendarActivity,
): Promise<CalendarStatusMap> {
  try {
    const { data } = await firebaseCloudFunctionsInstance.httpsCallable(
      'getCalendarActivityLog',
    )(payload);
    return data as CalendarStatusMap;
  } catch (error) {
    throw error;
  }
}

/** Get calendar activity log */
export async function updateActivityLog(
  payload: IUpdateLogRequestData,
): Promise<IUpdateLogResponseData> {
  try {
    const { data } =
      await firebaseCloudFunctionsInstance.httpsCallable('updateActivityLog')(
        payload,
      );
    return data as IUpdateLogResponseData;
  } catch (error) {
    throw error;
  }
}
