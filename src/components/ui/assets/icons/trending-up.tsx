import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

export function TrendingUp(props) {
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
      className="lucide lucide-trending-up-icon lucide-trending-up"
      {...props}
    >
      <Path d="M16 7h6v6" />
      <Path d="m22 7-8.5 8.5-5-5L2 17" />
    </Svg>
  );
}
