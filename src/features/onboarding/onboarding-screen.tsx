import { useRouter } from 'expo-router';
import * as React from 'react';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';
import { Cover } from './components/cover';

export function OnboardingScreen() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex h-full items-center justify-center">
      <FocusAwareStatusBar />
      <View className="w-full flex-1">
        <Cover />
      </View>
      <View className="justify-end">
        <Text className="my-3 text-center font-bold-poppins text-5xl">
          Poop AI
        </Text>
        <Text className="mb-2 text-center font-primary-poppins text-lg text-gray-600">
          The right way to build your mobile app
        </Text>

        <Text className="my-1 pt-6 text-left font-primary-poppins text-lg">
          🚀 Production-ready{' '}
        </Text>
        <Text className="my-1 text-left font-primary-poppins text-lg">
          🥷 Developer experience + Productivity
        </Text>
        <Text className="my-1 text-left font-primary-poppins text-lg">
          🧩 Minimal code and dependencies
        </Text>
        <Text className="my-1 text-left font-primary-poppins text-lg">
          💪 well maintained third-party libraries
        </Text>
      </View>
      <SafeAreaView className="mt-6">
        <Button
          label="Let's Get Started "
          textClassName="font-semibold-poppins"
          onPress={() => {
            setIsFirstTime(false);
            router.replace('/login');
          }}
        />
      </SafeAreaView>
    </View>
  );
}
