import type { ITabsNavigationScreen } from '@/lib/navigation/tabs/tabs.interface';
import { useNetInfo } from '@react-native-community/netinfo';
import * as QuickActions from 'expo-quick-actions';
import { useQuickActionRouting } from 'expo-quick-actions/router';
import { Redirect, router, Tabs, useSegments } from 'expo-router';
import { firebaseAuth } from 'firebase/config';
import { checkForAppUpdate } from 'firebase/remote-config';
import * as React from 'react';

import { useEffect } from 'react';
import { useUniwind } from 'uniwind';
import { useInitializeRevenueCat } from '@/api/subscription/subscription.hooks';
import { useUser } from '@/api/user/user.hooks';
import CustomHeader from '@/components/cusom-header';
import InitialLoadSpinner from '@/components/initial-load-spinner.ts';
import { TabBarIcon } from '@/components/tab-bar-icon';

import { colors, SafeAreaView, useModal } from '@/components/ui';

import { useIsFirstTime } from '@/hooks';
import { useCrashlytics } from '@/hooks/use-crashlytics';
import { useHaptic } from '@/hooks/use-haptics';
import { useIsOnboarded } from '@/hooks/use-is-onboarded';
import useKeyboard from '@/hooks/use-keyboard';
import { usePushNotificationToken } from '@/hooks/use-push-notification-token';
import usePushNotifications from '@/hooks/use-push-notifications';
import useRemoteConfig from '@/hooks/use-remote-config';
import { translate, useSelectedLanguage } from '@/lib/i18n';
import { tabScreens } from '@/lib/navigation/tabs';
import { getBottomTabBarStyle } from '@/lib/navigation/tabs/tabs.styles';
import { DEVICE_TYPE } from '@/utilities/device-type';
import NoInternet from '../no-internet';

export default function TabLayout() {
  const isLoggedIn = !!firebaseAuth.currentUser?.uid;
  const [isFirstTime] = useIsFirstTime();
  const { language } = useSelectedLanguage();
  const { isConnected } = useNetInfo();
  const modal = useModal();

  usePushNotifications(); // push notifications popup
  const { storeDeviceInfo } = usePushNotificationToken();

  const addSelectionHapticEffect = useHaptic('selection');
  const addHeavyHapticEffect = useHaptic('heavy');
  const { isPending: isPendingRevenueCatSdkInit } = useInitializeRevenueCat(
    firebaseAuth.currentUser?.uid as string,
  );
  const { data: userInfo, isPending: isPendingUserinfo } = useUser(language);
  const { theme } = useUniwind();
  const isDark = theme === 'dark';
  const segments = useSegments();

  const bottomTabBarStyles = getBottomTabBarStyle(isDark);
  const { isKeyboardVisible } = useKeyboard();

  const { logEvent } = useCrashlytics();
  const [isOnboarded] = useIsOnboarded();

  useQuickActionRouting();

  const { MINIMUM_VERSION_ALLOWED } = useRemoteConfig();

  checkForAppUpdate(MINIMUM_VERSION_ALLOWED);

  useEffect(() => {
    // Guard clause: Skip logic if isConnected is null
    if (isConnected === null) return;

    if (!isConnected) {
      router.navigate('/no-internet');
      // playSound('error');
      addHeavyHapticEffect?.();
    } else {
      modal.dismiss();
    }
  }, [isConnected, modal, addHeavyHapticEffect]);

  useEffect(() => {
    QuickActions.setItems<QuickActions.Action>([
      {
        title: translate('deleteApp.title'),
        subtitle: translate('deleteApp.subtitle'),
        icon: 'heart_icon',
        id: '0',
        params: { href: '/rate' },
      },
    ]);
  }, []);

  useEffect(() => {
    storeDeviceInfo();
  }, []);

  if (isConnected === false && isConnected !== null) return <NoInternet />;

  if (isPendingUserinfo || isPendingRevenueCatSdkInit)
    return <InitialLoadSpinner />;

  if (isFirstTime && !userInfo) {
    logEvent(`User ${userInfo?.userId} is redirected to welcome screen`);
    return <Redirect href="/welcome" />;
  }
  if (isFirstTime && !isLoggedIn) {
    logEvent(`User ${userInfo?.userId} is redirected to welcome screen`);
    return <Redirect href="/welcome" />;
  }
  if (!isPendingUserinfo && !isPendingRevenueCatSdkInit && !userInfo) {
    return <Redirect href="/welcome" />;
  }
  if (!isOnboarded) {
    return <Redirect href="/onboarding" />;
  }

  return (
    <Tabs
      screenOptions={{
        // tabBarHideOnKeyboard: DEVICE_TYPE.ANDROID && isKeyboardVisible,
        tabBarStyle: {
          ...bottomTabBarStyles.tabBarContainer,
          display: segments.includes('scan') ? 'none' : 'flex',
          marginBottom:
            DEVICE_TYPE.ANDROID &&
            isKeyboardVisible &&
            (segments.includes('activity') || segments.includes('(app)'))
              ? -300
              : 0,
        },
        tabBarLabelStyle: bottomTabBarStyles.tabBarLabel,
        tabBarInactiveTintColor: colors.white,
        // tabBarActiveTintColor: '#3195FD',
      }}
    >
      {tabScreens.map((tab: ITabsNavigationScreen) => (
        <Tabs.Screen
          key={tab.id}
          name={tab.screenName}
          listeners={{
            tabPress: () => {
              addSelectionHapticEffect?.();
              // logEvent(
              //   `User ${userInfo.userId} navigated to ${tab.screenName}`
              // );
            },
          }}
          options={{
            header: (props) =>
              tab.header && (
                <CustomHeader
                  {...props}
                  title={tab.title}
                  titlePosition="left"
                />
              ),
            title: tab.title,
            // tabBarStyle: {
            //   display: tab.screenName === 'scan' ? 'none' : 'flex',
            //   backgroundColor: 'black',
            // },
            tabBarIcon: ({ color, focused }) => (
              <TabBarIcon
                icon={tab.icon(color, focused)}
                focused={focused}
                isScanScreen={tab.screenName === 'scan'}
                textClassName={`text-sm text-center w-full ${focused ? 'font-bold-poppins text-primary-900 dark:text-primary-900' : 'font-medium-poppins'} `}
                title={tab.title}
              />
            ),
            tabBarTestID: tab.tabBarTestID,
          }}
        />
      ))}
    </Tabs>
  );
}
