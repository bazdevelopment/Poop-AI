import type { TxKeyPath } from '@/lib/i18n';

import * as React from 'react';

import { View } from 'react-native';
import { Text } from '../ui';

type Props = {
  children: React.ReactNode;
  title?: TxKeyPath;
};

export function ItemsContainer({ children, title }: Props) {
  return (
    <View className="my-4 flex-1">
      {title && (
        <Text
          className="mb-2 font-semibold-poppins text-lg text-white"
          tx={title}
        />
      )}
      <View className="gap-3">{children}</View>
    </View>
  );
}
