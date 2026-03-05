import type { ConfigContext, ExpoConfig } from '@expo/config';

import type { AppIconBadgeConfig } from 'app-icon-badge/types';

import 'tsx/cjs';

// adding lint exception as we need to import tsx/cjs before env.ts is imported
// eslint-disable-next-line perfectionist/sort-imports
import Env from './env';

const EXPO_ACCOUNT_OWNER = 'bazdevelopment';

const appIconBadgeConfig: AppIconBadgeConfig = {
  enabled: Env.EXPO_PUBLIC_APP_ENV !== 'production',
  badges: [
    {
      text: Env.EXPO_PUBLIC_APP_ENV,
      type: 'banner',
      color: 'white',
    },
    {
      text: Env.EXPO_PUBLIC_VERSION.toString(),
      type: 'ribbon',
      color: 'white',
    },
  ],
};

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: Env.EXPO_PUBLIC_NAME,
  description: `${Env.EXPO_PUBLIC_NAME} Mobile App`,
  owner: EXPO_ACCOUNT_OWNER,
  scheme: Env.EXPO_PUBLIC_SCHEME,
  slug: 'poop-ai',
  version: Env.EXPO_PUBLIC_VERSION.toString(),
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    appStoreUrl: '',
    supportsTablet: true,
    bundleIdentifier: Env.EXPO_PUBLIC_BUNDLE_ID,
    googleServicesFile: Env.EXPO_PUBLIC_GOOGLE_SERVICES_PLIST_PATH,

    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      CFBundleLocalizations: [
        // 'de', // German
        // 'tr', // Turkish
        // 'fr', // French
        // 'it', // Italian
        // 'pt-PT', // Portuguese (Portugal)
        // 'ar', // Arabic
        // 'es-ES', // Spanish (Spain)
        // 'es-MX', // Spanish (Mexico)
        // 'hi', // Hindi
        // 'ro', // Romanian
        // 'uk', // Ukrainian
        // 'ru', // Russian
        // 'th', // Thai
        // 'id', // Indonesian
        // 'he', // Hebrew
        // 'ja', // Japanese
        // 'ko', // Korean
        // 'zh', // Chinese (Simplified)
        // 'no', // Norwegian
        // 'pl', // Polish
        // 'sv', // Swedish
        'en', // English
        // 'fr-CA', // French (Canada)
        // 'pt-BR', // Portuguese (Brazil)
        // 'vi', // Vietnamese
        // 'nl', // Dutch
        // 'cs', // Czech
        // 'el', // Greek
        // 'hu', // Hungarian
        // 'ms', // Malay
        // 'fi', // Finnish
        // 'da', // Danish
        // 'sk', // Slovak
        // 'hr', // Croatian
        // 'ca', // Catalan
      ],
      CFBundleDevelopmentRegion: 'en', // Default language, adjust if needed
    },
  },
  experiments: {
    typedRoutes: true,
  },
  android: {
    playStoreUrl: '',
    googleServicesFile: Env.EXPO_PUBLIC_GOOGLE_SERVICES_JSON_PATH,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#895129',
    },
    package: Env.EXPO_PUBLIC_PACKAGE,
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro',
  },
  plugins: [
    [
      'expo-splash-screen',
      {
        backgroundColor: '#895129',
        image: './assets/icon_transparent-v2.png',
        imageWidth: 150,
      },
    ],
    [
      'expo-font',
      {
        ios: {
          fonts: [
            'node_modules/@expo-google-fonts/poppins/400Regular/Poppins_400Regular.ttf',
            'node_modules/@expo-google-fonts/poppins/500Medium/Poppins_500Medium.ttf',
            'node_modules/@expo-google-fonts/poppins/600SemiBold/Poppins_600SemiBold.ttf',
            'node_modules/@expo-google-fonts/poppins/700Bold/Poppins_700Bold.ttf',
          ],
        },
        android: {
          fonts: [
            {
              fontFamily: 'Poppins',
              fontDefinitions: [
                {
                  path: 'node_modules/@expo-google-fonts/poppins/400Regular/Poppins_400Regular.ttf',
                  weight: 400,
                },
                {
                  path: 'node_modules/@expo-google-fonts/poppins/500Medium/Poppins_500Medium.ttf',
                  weight: 500,
                },
                {
                  path: 'node_modules/@expo-google-fonts/poppins/600SemiBold/Poppins_600SemiBold.ttf',
                  weight: 600,
                },
                {
                  path: 'node_modules/@expo-google-fonts/poppins/700Bold/Poppins_700Bold.ttf',
                  weight: 700,
                },
              ],
            },
          ],
        },
      },
    ],
    [
      'expo-quick-actions',
      {
        androidIcons: {
          heart_icon: {
            foregroundImage: './assets/heart-icon-android.png',
            backgroundColor: '#FFFFFF',
          },
        },
        iosIcons: {
          heart_icon: './assets/heart-icon-ios.png',
        },
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/icon_notification_96x96_2.png',
        color: '#1d1e3c',
        defaultChannel: 'default',
      },
    ],
    [
      'expo-image-picker',
      {
        photosPermission:
          'Allow $(PRODUCT_NAME) to access your photo library to upload media for AI analysis, providing insights and feedback for informational purposes.',
        cameraPermission:
          'Allow $(PRODUCT_NAME) to access your camera to capture images for AI-powered analysis, providing insights and feedback for informational purposes.',
        // 'Disables the microphone permission',
        microphonePermission: false,
      },
    ],
    [
      'expo-document-picker',
      {
        iCloudContainerEnvironment: 'Production',
      },
    ],
    [
      'expo-build-properties',
      {
        ios: {
          useFrameworks: 'static',
          buildReactNativeFromSource: true,
        },
      },
    ],
    'expo-localization',
    'expo-router',
    '@react-native-firebase/app',
    '@react-native-firebase/auth',
    '@react-native-firebase/crashlytics',
    ['app-icon-badge', appIconBadgeConfig],
    ['react-native-edge-to-edge'],
    [
      'expo-camera',
      {
        cameraPermission:
          'Allow $(PRODUCT_NAME) to access your camera to capture images for AI analysis',
      },
    ],
  ],
  extra: {
    eas: {
      projectId: Env.EXPO_PUBLIC_EAS_PROJECT_ID,
    },
  },
});
