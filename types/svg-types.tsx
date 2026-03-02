import type { SvgProps } from 'react-native-svg';

export type ISvgProps = {
  xmlns?: string;
  xmlSpace?: string;
  withLinearGradient?: boolean;
  top?: number;
  isRead?: boolean;
  focused?: boolean;
} & SvgProps;
