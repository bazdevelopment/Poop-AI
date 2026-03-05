import * as React from 'react';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';

import Avatar from '@/components/avatar';
import FadeInView from '@/components/fade-in-view/fade-in-view';
import HorizontalLine from '@/components/horizontal-line';
import PremiumFeaturesOverview from '@/components/premium-features-overivew';
import { Button, colors } from '@/components/ui';
import { ArrowRightSharp } from '@/components/ui/assets/icons/arrow-right-sharp';
import { StarIcon } from '@/components/ui/assets/icons/star';
import useRemoteConfig from '@/hooks/use-remote-config';
import { translate } from '@/lib/i18n';
import { DEVICE_TYPE } from '@/utilities/device-type';
import { requestAppRatingWithDelay } from '@/utilities/request-app-review';

// Social Proof Component
function SocialProofCard() {
  return (
    <View className="rounded-2xl border-[1.5px] border-primary-900 bg-primary-900/10 p-5 dark:bg-charcoal-900">
      <View className="mb-1 flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View className="mr-3 mb-2 size-8 items-center justify-center overflow-hidden rounded-full">
            <Avatar
              image={require('../../../components/ui/assets/images/random/middle-age-male.png')}
              size="small"
              shape="circle"
            />
          </View>
          <View className="flex-row gap-4">
            <Text className="font-bold-poppins text-lg text-gray-900 dark:text-white">
              David B.
            </Text>
            <View className="flex-row gap-1">
              <StarIcon
                color={colors.warning[400]}
                fill={colors.warning[400]}
              />
              <StarIcon
                color={colors.warning[400]}
                fill={colors.warning[400]}
              />
              <StarIcon
                color={colors.warning[400]}
                fill={colors.warning[400]}
              />
              <StarIcon
                color={colors.warning[400]}
                fill={colors.warning[400]}
              />
              <StarIcon
                color={colors.warning[400]}
                fill={colors.warning[400]}
              />
            </View>
          </View>
        </View>
      </View>

      <Text className="font-bold-poppins text-base/5 text-sm dark:text-white">
        {translate('rootLayout.screens.freeTrialPreview.review')}
      </Text>
      <Text className="mt-2 text-sm text-gray-900 dark:text-white">
        {translate('rootLayout.screens.freeTrialPreview.reviewTrust')}
      </Text>
    </View>
  );
}

function FreeTrialPreview({ onFinish }) {
  const { SHOW_SOCIAL_PROOF_ONBOARDING } = useRemoteConfig();
  console.log('onFinish', onFinish);
  useEffect(() => {
    requestAppRatingWithDelay(500);
  }, []);

  return (
    <View className="flex-1 dark:bg-transparent">
      <ScrollView
        className={`px-5 ${DEVICE_TYPE.ANDROID && 'pt-[42]'}`}
        contentContainerClassName={`${DEVICE_TYPE.ANDROID ? 'pb-20' : ''}`}
        showsVerticalScrollIndicator={false}
      >
        <Text className="mb-6 text-center font-bold-poppins text-3xl text-primary-900">
          {translate('rootLayout.screens.freeTrialPreview.heading')}
        </Text>

        {SHOW_SOCIAL_PROOF_ONBOARDING && (
          <FadeInView delay={100}>
            <SocialProofCard />
          </FadeInView>
        )}
        <HorizontalLine className="mt-4 mb-3" />
        <PremiumFeaturesOverview />
      </ScrollView>
      {/* Bottom Navigation */}
      <View className="bottom-10 px-6">
        <Button
          label={translate('general.continue')}
          variant="default"
          className="h-[55px] rounded-full bg-primary-900 pl-5 dark:bg-primary-900"
          textClassName="font-semibold-poppins text-lg dark:text-white "
          iconPosition="right"
          icon={<ArrowRightSharp color={colors.white} />}
          onPress={onFinish}
        />
      </View>
    </View>
  );
}

export default FreeTrialPreview;
