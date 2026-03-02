import { StyleSheet } from 'react-native';

import { colors } from '@/components/ui';
import { DEVICE_TYPE } from '@/utilities/device-type';

export function getBottomTabBarStyle(isDark: boolean) {
  return StyleSheet.create({
    tabBarContainer: {
      paddingBottom: DEVICE_TYPE.isPad ? 40 : 0,
      // paddingBottom: DEVICE_TYPE.ANDROID ? 10 : 26,
      backgroundColor: colors.blackEerie,
      borderRadius: 100,
      justifyContent: 'center',
      alignSelf: 'center',
      width: '75%',
      bottom: DEVICE_TYPE.IOS ? 30 : 0,
      height: 80,
      alignItems: 'center',
      shadowColor: colors.black,
      borderWidth: 0.5,
      borderTopWidth: 0.5,
      borderColor: colors.charcoal[800],
    },
    tabBarLabel: {
      color: 'red',
      display: 'none',
    },
  });
}
