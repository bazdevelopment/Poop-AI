import type { ITabBarIcon } from './tab-bar-icon.interface';

import { Animated } from 'react-native';

import { DEVICE_TYPE } from '@/utilities/device-type';
import Dot from '../dot';
import { Text } from '../ui';

export function TabBarIcon({
  icon,
  focused,
  textClassName,
  isScanScreen,
  _title,
}: ITabBarIcon) {
  // Create animation value
  const scaleValue = new Animated.Value(focused ? 0.9 : 0.8);

  // useEffect(() => {
  //   Animated.spring(scaleValue, {
  //     toValue: focused && !isScanScreen ? 0.9 : 0.8,
  //     useNativeDriver: true,
  //     friction: 4,
  //   }).start();
  // }, [focused, scaleValue]);

  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleValue }],
      }}
      className={`size-[60] flex-col items-center justify-center gap-2 rounded-full p-2 ${focused ? 'bg-black' : !focused && isScanScreen ? 'bg-primary-100' : 'bg-black'} ${isScanScreen ? 'size-[75]' : 'top-2'} ${DEVICE_TYPE.IOS ? 'mt-8' : 'mt-8'}`}
    >
      {icon}
      {isScanScreen && (
        <Text className="font-bold-poppins text-xs text-black dark:text-black">
          SCAN
        </Text>
      )}
      {focused && <Dot color="bg-primary-100 w-[5px] h-[5px] rounded-full" />}
    </Animated.View>
  );
}
