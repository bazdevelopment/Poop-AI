import type { ISegmentedControlOption } from '../../segmented-control.interface';

export type ISegmentedControlTab = {
  option: ISegmentedControlOption;
  onPress: (option: ISegmentedControlOption) => void;
  isActive: boolean;
  tabWidth: number;
  tabInactiveColor?: string;
  borderColor?: string;
  withBorder?: boolean;
};
