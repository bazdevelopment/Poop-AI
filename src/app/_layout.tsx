import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import FlashMessage from 'react-native-flash-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { Toaster } from 'sonner-native';
import { APIProvider } from '@/api/common';
import { useThemeConfig } from '@/components/ui/use-theme-config';
import { hydrateAuth } from '@/features/auth/use-auth-store';
import { loadSelectedTheme } from '@/hooks';
import { DEVICE_TYPE } from '@/utilities/device-type';
// Import  global CSS file
import '../global.css';

export { ErrorBoundary } from 'expo-router';

// eslint-disable-next-line react-refresh/only-export-components
export const unstable_settings = {
  initialRouteName: '(app)',
};

hydrateAuth();
loadSelectedTheme();
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 500,
  fade: true,
});

export default function RootLayout() {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  return (
    <Providers>
      <Stack>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen
          name="welcome"
          options={{
            headerShown: false,
            ...(DEVICE_TYPE.IOS && {
              animation: 'fade',
              animationDuration: 500,
            }),
          }}
        />
        <Stack.Screen
          name="new-app-version"
          options={{
            headerShown: false,
            gestureEnabled: false,
            presentation: 'fullScreenModal',
          }}
        />
        <Stack.Screen
          name="gut-states"
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="paywall-new"
          options={{
            headerShown: false,
            gestureEnabled: false,
            presentation: 'modal',
          }}
        />
      </Stack>
    </Providers>
  );
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig();
  return (
    <GestureHandlerRootView
      style={styles.container}
      // eslint-disable-next-line better-tailwindcss/no-unknown-classes
      className={theme.dark ? `dark` : undefined}
    >
      <KeyboardProvider>
        <ThemeProvider value={theme}>
          <APIProvider>
            <BottomSheetModalProvider>
              {children}
              <Toaster
                autoWiggleOnUpdate="toast-change"
                pauseWhenPageIsHidden
              />
            </BottomSheetModalProvider>
          </APIProvider>
        </ThemeProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
