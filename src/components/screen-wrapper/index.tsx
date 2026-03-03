import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';

import { DEVICE_TYPE } from '@/utilities/device-type';
import { FocusAwareStatusBar, SafeAreaView } from '../ui';

function ScreenWrapper({ children }: { children: React.ReactNode }) {
  return (
    <LinearGradient
      colors={['#000000', '#0a1420']}
      start={{ x: 0, y: 1 }}
      end={{ x: 0, y: 0.5 }}
      locations={[0.5, 1]}
      style={{ flex: 1 }}
    >
      {/* <SafeAreaView className={`${DEVICE_TYPE.ANDROID ? 'mt-4' : ''}`}> */}
      <FocusAwareStatusBar hidden />
      {children}
      {/* </SafeAreaView> */}
    </LinearGradient>
  );
}

export default ScreenWrapper;
