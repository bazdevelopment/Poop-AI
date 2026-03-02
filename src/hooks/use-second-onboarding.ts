import { useMMKVBoolean } from 'react-native-mmkv';
import { storage } from '@/lib/storage';

const IS_SECOND_ONBOARDING_DONE = 'IS_SECOND_ONBOARDING_DONE';

export function useSecondOnboarding() {
  const [isSecondOnboardingDone, setIsSecondOnboardingDone] = useMMKVBoolean(
    IS_SECOND_ONBOARDING_DONE,
    storage,
  );
  if (isSecondOnboardingDone === undefined) {
    return [false, setIsSecondOnboardingDone] as const;
  }
  return [isSecondOnboardingDone, setIsSecondOnboardingDone] as const;
}
