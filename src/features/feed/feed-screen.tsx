import type { Post } from './api';
import { FlashList } from '@shopify/flash-list';

import * as React from 'react';
import {
  EmptyList,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { usePosts } from './api';
import { PostCard } from './components/post-card';

export function FeedScreen() {
  const { data, isPending, isError } = usePosts();
  const renderItem = React.useCallback(
    ({ item }: { item: Post }) => <PostCard {...item} />,
    [],
  );

  if (true) {
    return (
      <SafeAreaView className="flex-1">
        <View>
          <Text> Error Loading data </Text>
        </View>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView className="flex-1 border-2 border-red-200">
      <FocusAwareStatusBar />
      <FlashList
        data={data}
        renderItem={renderItem}
        keyExtractor={(_, index) => `item-${index}`}
        ListEmptyComponent={<EmptyList isLoading={isPending} />}
      />
    </SafeAreaView>
  );
}
