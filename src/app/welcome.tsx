import { getCalendars } from 'expo-localization';
import { firebaseAuth } from 'firebase/config';

import * as React from 'react';
import {
  Keyboard,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCreateAnonymousAccount } from '@/api/user/user.hooks';
import Branding from '@/components/branding';
import { Button, Image, SafeAreaView, Text } from '@/components/ui';
import { useIsFirstTime } from '@/hooks';
import { useStoreUserId } from '@/hooks/use-store-user-id';
import { translate, useSelectedLanguage } from '@/lib/i18n';
import getDeviceSizeCategory from '@/utilities/get-device-size-category';

function Welcome() {
  const { isVerySmallDevice, isLargeDevice } = getDeviceSizeCategory();
  const [storedUserId, setUserId] = useStoreUserId();
  const { language } = useSelectedLanguage();
  const [_, setIsFirstTime] = useIsFirstTime();
  const [{ timeZone }] = getCalendars();

  // const [isOnboarded] = useIsOnboarded();
  const onSuccessHandler = (userId: string) => {
    // update internal storage with userId and set is first time when opening the app to false
    setUserId(userId);
    setIsFirstTime(false);
    // !isOnboardingRunning
    //   ? router.navigate('/onboarding')
    //   : router.navigate('/(app)');
  };

  const { mutate: onCreateAnonymousAccount, isPending: isLoginPending } =
    useCreateAnonymousAccount(onSuccessHandler);

  return (
    <ScrollView
      contentContainerClassName="bg-transparent dark:bg-transparent"
      showsVerticalScrollIndicator={false}
    >
      <SafeAreaView>
        <View className="items-center justify-center px-6 pt-14 pb-32">
          <Branding isLogoVisible isNameVisible />
          <Text className="my-10 text-center font-bold-poppins text-[30px] text-primary-900">
            {translate('rootLayout.screens.welcome.heading')}
          </Text>
          <Image
            source={require('../components/ui/assets/images/moods/happy-enough.png')}
            className="size-65"
          />
          {/* <WelcomeIllustration
            width={isVerySmallDevice ? 250 : 300}
            height={isVerySmallDevice ? 250 : 300}
          /> */}
          <View
            className={`mt-16 ${isLargeDevice ? 'mt-20 w-[50%]' : 'w-full'}`}
          >
            <Button
              label={translate('rootLayout.screens.welcome.startButton')}
              variant="default"
              className="h-[55px] rounded-xl bg-primary-900 pl-5 dark:bg-primary-900"
              textClassName="font-semibold-poppins text-lg dark:text-white "
              iconPosition="left"
              loading={isLoginPending}
              onPress={() => {
                onCreateAnonymousAccount({
                  timezone: timeZone,
                  username: '-',
                  language,
                  // submit the stored user id, otherwise check for firebase uid
                  // do not rely only on firebaseAuth.currentUser?.uid,because if the user logs out it will become undefined, but the storedUserId will still be populated
                  actualUserId: storedUserId || firebaseAuth.currentUser?.uid,
                });
                Keyboard.dismiss();
              }}
            />
          </View>

          <View className="mt-6 w-full flex-row flex-wrap items-center justify-center px-12">
            <Text className="text-sm">
              {translate('rootLayout.screens.login.agreeingMessage')}{' '}
            </Text>
            <TouchableOpacity onPress={() => Linking.openURL('')}>
              <Text className="text-sm text-primary-900 dark:text-primary-900">
                {translate('rootLayout.screens.login.termsAndConditions')}
              </Text>
            </TouchableOpacity>
            <Text className="text-sm"> {translate('general.and')} </Text>
            <TouchableOpacity onPress={() => Linking.openURL('')}>
              <Text className="text-sm text-primary-900 dark:text-primary-900">
                {translate('rootLayout.screens.login.privacyPolicy')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

export default Welcome;
