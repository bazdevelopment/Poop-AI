import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function TrendingDown(props) {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      className="lucide lucide-trending-down-icon lucide-trending-down"
      {...props}
    >
      <Path d="M16 17h6v-6" />
      <Path d="m22 17-8.5-8.5-5 5L2 7" />
    </Svg>
  );
}
