import type { ITabsNavigationScreen } from './tabs.interface';

import * as React from 'react';
import { colors } from '@/components/ui';
import { Feed as FeedIcon, Settings } from '@/components/ui/assets/icons';
import ScanIcon from '@/components/ui/assets/icons/scan';
import { translate } from '@/lib/i18n';

export const tabScreens: ITabsNavigationScreen[] = [
  {
    id: 1,
    screenName: 'index',
    title: translate('home.tab'),
    tabBarTestID: 'home-tab',
    icon: (color: string, focused: boolean) => (
      <FeedIcon color={color} focused={focused} width={24} height={24} />
    ),
    header: false,
  },
  {
    id: 2,
    screenName: 'scan',
    title: 'Scan',
    tabBarTestID: 'scan-tab',
    icon: (color: string, focused: boolean) => (
      <ScanIcon color={colors.black} focused={focused} width={35} height={35} />
    ),
    header: false,
  },

  {
    id: 3,
    screenName: 'settings',
    title: translate('settings.tab'),
    tabBarTestID: 'settings-tab',
    icon: (color: string, focused: boolean) => (
      <Settings color={color} focused={focused} />
    ),
    header: false,
  },
];
