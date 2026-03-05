import { useMMKVString } from 'react-native-mmkv';

import { storage } from '../lib/storage';

const USER_ID = 'USER_ID';

export function useStoreUserId() {
  const [userId, setUserId] = useMMKVString(USER_ID, storage);

  // If userId is undefined (not set), return an empty string as the default value
  if (userId === undefined) {
    return ['', setUserId] as const;
  }

  return [userId, setUserId] as const;
}
