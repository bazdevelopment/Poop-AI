import type { Nullable } from 'types/general-types';
import type { ISegmentedControlOption } from '../segmented-control/segmented-control.interface';
import type {
  CalendarStatusMap,
  IActivityLog,
} from '@/api/activity-logs/activity-logs.types';

export type ICalendarMiniView = {
  showYear: boolean;
  showMonth: boolean;
  containerClassName: string;
  currentWeekActivityLog: CalendarStatusMap;
  segmentedDays: ISegmentedControlOption[];
  currentMonth: string;
  currentYear: number;
  initialDayFocused: Nullable<ISegmentedControlOption>;
  currentMonthNumber: string;
  onDayPress?: (data: IActivityLog) => void;
  showStreak?: boolean;
  currentStreak?: number;
};
