import { Animated, View } from 'react-native';
import { useBouncingMessage } from '@/hooks/use-bouncing-message';

function BounceLoader({
  loadingMessages,
  className,
  textClassName,
}: {
  loadingMessages: string[];
  className?: string;
  textClassName?: string;
}) {
  const { fadeValue, loadingMessage } = useBouncingMessage(loadingMessages);
  return (
    <View className={className}>
      {/* Fading Loading Message */}
      <Animated.Text
        className={`mt-2 h-14 text-center font-medium-poppins ${textClassName}`}
        style={{ opacity: fadeValue }}
      >
        {loadingMessage}
      </Animated.Text>
    </View>
  );
}

export default BounceLoader;
