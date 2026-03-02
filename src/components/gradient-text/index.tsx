import type { IGradientText } from './gradient-text.interface';
import MaskedView from '@react-native-community/masked-view';
import { LinearGradient } from 'expo-linear-gradient';

import * as React from 'react';
import { Text } from '../ui';

function GradientText({ colors, ...props }: IGradientText) {
  return (
    <MaskedView maskElement={<Text {...props} />}>
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
}
export default GradientText;
