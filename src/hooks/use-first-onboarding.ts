import { useMMKVBoolean } from 'react-native-mmkv';
import { storage } from '@/lib/storage';

const IS_FIRST_ONBOARDING_DONE = 'IS_FIRST_ONBOARDING_DONE';

export function useFirstOnboarding() {
  const [isFirstOnboardingDone, setIsFirstOnboardingDone] = useMMKVBoolean(
    IS_FIRST_ONBOARDING_DONE,
    storage,
  );
  if (isFirstOnboardingDone === undefined) {
    return [false, setIsFirstOnboardingDone] as const;
  }
  return [isFirstOnboardingDone, setIsFirstOnboardingDone] as const;
}
