import { getCalendars } from 'expo-localization';
// import { Activity, ArrowDown, ArrowUp, Info } from 'lucide-react-native';
import * as React from 'react';
import { Image, ScrollView, TouchableOpacity } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useGetCalendarActivityLog } from '@/api/activity-logs/activity-logs.hooks';
import { useAllUserConversations } from '@/api/conversation/conversation.hooks';
import { useUser } from '@/api/user/user.hooks';
import Branding from '@/components/branding';
import CalendarMiniView from '@/components/calendar-mini-view';
import { colors, SafeAreaView, Text, View } from '@/components/ui';
import { ChartIcon } from '@/components/ui/assets/icons/chart';
import { TrendingDown } from '@/components/ui/assets/icons/trending-down';
import { TrendingUp } from '@/components/ui/assets/icons/trending-up';
import { MAX_DAILY_ACTIVITIES } from '@/constants/limits';
import useRemoteConfig from '@/hooks/use-remote-config';
import { useWeekNavigation } from '@/hooks/use-week-navigation';
import { useSelectedLanguage } from '@/lib/i18n';
import { generateWeekDataOverview } from '@/utilities/generate-week-data-overview';

// --- 1. MOCK DATA & ASSET MAPPING ---
// You will replace these requires with your actual paths.
// Based on your screenshot, I am mapping ranges to your 'moods' folder.
function getGutState(score) {
  // 78% - 100% (Optimal/Good) -> Highlight 3rd line
  if (score >= 90) {
    return {
      label: 'Optimal',
      color: '#4ADE80',
      textClass: 'text-green-400',
      bgClass: 'bg-green-400',
      activeLine: 3,
      image: require('../../components/ui/assets/images/moods/very-happy.png'),
    };
  }
  if (score >= 75) {
    return {
      label: 'Good',
      color: '#A3E635',
      textClass: 'text-lime-400',
      bgClass: 'bg-lime-400',
      activeLine: 3,
      image: require('../../components/ui/assets/images/moods/happy-enough.png'),
    };
  }

  // 65% - 77% (Sufficient) -> Highlight 2nd line
  if (score >= 60) {
    return {
      label: 'Sufficient',
      color: '#FBBF24',
      textClass: 'text-amber-400',
      bgClass: 'bg-amber-400',
      activeLine: 2,
      image: require('../../components/ui/assets/images/moods/neutral.png'),
    };
  }

  // 0% - 64% (Poor/Critical) -> Highlight 1st line
  if (score >= 30) {
    return {
      label: 'Poor',
      color: '#F87171',
      textClass: 'text-red-400',
      bgClass: 'bg-red-400',
      activeLine: 1,
      image: require('../../components/ui/assets/images/moods/sad.png'),
    };
  }
  return {
    label: 'Critical',
    color: '#DC2626',
    textClass: 'text-red-600',
    bgClass: 'bg-red-600',
    activeLine: 1,
    image: require('../../components/ui/assets/images/moods/very-angry.png'),
  };
}
const recentLogs = [
  { id: 1, date: 'Today • 10:07 AM', score: 91, trend: 16, isUp: true },
  { id: 2, date: 'Today • 8:30 AM', score: 38, trend: 34, isUp: false },
  { id: 3, date: 'Yesterday • 3:10 PM', score: 75, trend: 11, isUp: true },
  { id: 4, date: 'Mon • 9:15 AM', score: 64, trend: 12, isUp: true },
];

const weekDays = [
  { day: 'M', logged: true },
  { day: 'T', logged: true },
  { day: 'W', logged: true },
  { day: 'T', logged: false },
  { day: 'F', logged: false },
  { day: 'S', logged: false },
  { day: 'S', logged: false },
];

// --- 2. CIRCULAR PROGRESS COMPONENT ---
function CircularProgress({ score }) {
  const { color, label, textClass, bgClass, activeLine } = getGutState(score);
  const size = 220;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <View className="relative my-8 items-center justify-center">
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          stroke="#3F3733"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* Progress Circle */}
        <Circle
          stroke={color}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      {/* Text inside the ring */}
      <View className="absolute items-center justify-center">
        <Text className="text-5xl font-bold tracking-tighter text-white">
          {score}%
        </Text>
        <Text className="mt-1 mb-2 text-sm font-bold tracking-widest text-stone-400">
          Gut Score
        </Text>
        <View className="flex-row items-center space-x-1">
          {/* Decorative dashes */}
          <View className="flex-row space-x-1">
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                className={`h-1 w-4 rounded-full ${i === activeLine ? bgClass : 'bg-stone-600'}`}
              />
            ))}
          </View>
        </View>
        <Text className={`mt-2 font-semibold ${textClass}`}>{label}</Text>
      </View>
    </View>
  );
}

// --- 3. MAIN SCREEN COMPONENT ---
export function HomeScreen() {
  const todayScore = recentLogs[0].score;
  const { language } = useSelectedLanguage();
  const { data: userInfo, refetch: refetchUserInfo } = useUser(language);

  const [{ timeZone }] = getCalendars();

  // const currentActiveDay = getCurrentDay('YYYY-MM-DD', language);

  /**
   * Mock CalendarStatusMap (currentWeekActivityLog)
   */
  const currentWeekActivityLogs: CalendarStatusMap = {
    '2026-02-29': {
      activityName: 'Morning Run',
      createdAt: '2026-03-02T06:30:00.000Z',
      date: { _seconds: 1772404200, _nanoseconds: 0 },
      description: '5km easy pace run around the neighborhood.',
      id: 'log-001',
      status: 'attended',
      type: 'fitness',
    },
    '2026-03-01': {
      activityName: 'Morning Run',
      createdAt: '2026-03-02T06:30:00.000Z',
      date: { _seconds: 1772404200, _nanoseconds: 0 },
      description: '5km easy pace run around the neighborhood.',
      id: 'log-001',
      status: 'completed',
      type: 'fitness',
    },
    '2026-03-02': {
      activityName: 'Morning Run',
      createdAt: '2026-03-02T06:30:00.000Z',
      date: { _seconds: 1772404200, _nanoseconds: 0 },
      description: '5km easy pace run around the neighborhood.',
      id: 'log-001',
      status: 'attended',
      type: 'fitness',
    },
    '2026-03-03': {
      activityName: 'Team Standup',
      createdAt: '2026-03-03T09:00:00.000Z',
      date: { _seconds: 1772490600, _nanoseconds: 0 },
      description: 'Daily engineering sync meeting.',
      id: 'log-002',
      status: 'attended',
      type: 'work',
    },
    '2026-03-04': {
      activityName: 'Yoga Session',
      createdAt: '2026-03-04T18:00:00.000Z',
      date: { _seconds: 1772577000, _nanoseconds: 0 },
      description: 'Evening flexibility and breathing exercises.',
      id: 'log-003',
      status: 'attended',
      type: 'wellness',
    },
    '2026-03-05': {
      activityName: 'Read 30 Minutes',
      createdAt: '2026-03-05T20:00:00.000Z',
      date: { _seconds: 1772663400, _nanoseconds: 0 },
      description: 'Read personal development book.',
      id: 'log-004',
      status: 'skipped',
      type: 'personal',
    },
  };

  const lastResetStreakDates = userInfo?.gamification.streakResetDates;
  const streakFreezeUsageDates = userInfo?.gamification?.streakFreezeUsageDates;
  const streakRepairDates = userInfo?.gamification?.streakRepairDates;
  const lastTimeLostStreakTimestamp =
    userInfo?.gamification?.lostStreakTimestamp;
  const lostStreakValue = userInfo?.gamification?.lostStreakValue;

  const {
    segmentedDays,
    currentMonth,
    currentYear,
    initialDayFocused,
    currentMonthNumber,
    startOfWeek,
    endOfWeek,
    weekOffset,
    currentDayNumber,
  } = useWeekNavigation();

  // const { data: currentWeekActivityLogs, refetch: refetchActivityLog } =
  //   useGetCalendarActivityLog({
  //     startDate: startOfWeek,
  //     endDate: endOfWeek,
  //     language,
  //   });

  const {
    MAX_CONVERSATIONS_ALLOWED_FREE_TRIAL,
    TOTAL_FREE_ACTIVITIES_FREE_TRIAL,
  } = useRemoteConfig();
  const { data } = useAllUserConversations();
  const conversationsCount = data?.count || 0;

  const todayDateKey = `${currentYear}-${currentMonthNumber}-${currentDayNumber}`;

  const isActivitiesLimitReached =
    currentWeekActivityLogs?.[todayDateKey]?.length >= MAX_DAILY_ACTIVITIES;

  const totalActivitiesPerWeek = currentWeekActivityLogs
    ? Object.values(currentWeekActivityLogs)?.filter(Boolean)?.flat()?.length
    : 0;

  const generatedWeekData = generateWeekDataOverview({
    currentWeekActivityLog: currentWeekActivityLogs,
    segmentedDays,
    lastResetStreakDates,
    initialDayFocused,
    streakFreezeUsageDates,
    streakRepairDates,
    lastTimeLostStreakTimestamp,
    lostStreakValue,
  });

  // First, transform your array into an object with date keys
  const generatedWeekDataMapped = generatedWeekData.reduce((acc, record) => {
    const dateKey = record.dateKey; // or however you get the date from your record
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(record);

    return acc;
  }, {});

  return (
    // <SafeAreaView className="h-200 bg-red-200">
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
    <SafeAreaView>
        <Branding
          isLogoVisible
          className="ml-4"
          imageClassname="size-[50px]"
          isNameVisible
        />
        {currentWeekActivityLogs && (
          <CalendarMiniView
            showMonth={false}
            showYear={false}
            showStreak={false}
            showProgress={false}
            currentStreak={userInfo?.gamification?.currentStreak}
            containerClassName="px-8 -mt-4"
            currentWeekActivityLog={currentWeekActivityLogs}
            segmentedDays={segmentedDays}
            currentMonth={currentMonth}
            currentYear={currentYear}
            initialDayFocused={initialDayFocused}
            currentMonthNumber={currentMonthNumber}
            weekOffset={weekOffset}
            // onDayPress={(data) => dailyActivityModal.present(data)}
            streakFreezeUsageDates={streakFreezeUsageDates}
            streakRepairDates={streakRepairDates}
            lastTimeLostStreakTimestamp={lastTimeLostStreakTimestamp}
            lostStreakValue={lostStreakValue}
          />
        )}
        {/* Header - Week Tracker */}
        {/* <View className="mb-6 flex-row items-center justify-between px-5">
          {weekDays.map((item, index) => (
            <View
              key={index}
              className={`size-10 items-center justify-center rounded-full border-2 ${item.logged ? 'border-amber-700 bg-amber-900/30' : 'border-stone-700 bg-stone-800'}`}
            >
              <Text
                className={`font-semibold ${item.logged ? 'text-amber-500' : 'text-stone-500'}`}
              >
                {item.day}
              </Text>
            </View>
          ))}
        </View> */}

        {/* Main Score Ring */}
        <CircularProgress score={todayScore} />

        {/* AI Actionable Insights (Extra Feature) */}
        {/* <View className="mb-8 flex-row items-start space-x-3 rounded-2xl border border-stone-700 bg-stone-800 p-4">
          <WarningIcon color="#A3E635" size={24} />
          <View className="flex-1">
            <Text className="mb-1 text-base font-semibold text-white">
              AI Insight
            </Text>
            <Text className="text-sm text-white dark:text-white">
              Your gut is performing optimally today. Continue your current
              fiber intake to maintain this state.
            </Text>
          </View>
        </View> */}

        {/* Recent Logs List */}
        <View className="mb-4 flex-row items-center justify-between px-5">
          <Text className="text-xl font-bold text-white">Recent</Text>
          <TouchableOpacity className="flex-row items-center gap-2">
            <Text className="font-semibold-poppins dark:text-primary-100">
              See All
            </Text>
            <ChartIcon color={colors.primary[100]} size={20} />
          </TouchableOpacity>
        </View>

        <View className="gap-4 space-y-4 px-5 pb-20">
          {recentLogs.map((log) => {
            const stateInfo = getGutState(log.score);
            return (
              <TouchableOpacity
                key={log.id}
                className="flex-row items-center overflow-hidden rounded-3xl border border-stone-700/50 bg-[#362B25] p-2 shadow-lg"
              >
                {/* Dynamic Image based on score */}
                <View className="mr-4 size-26 items-center justify-end">
                  <Image
                    source={stateInfo.image}
                    className="size-full"
                    resizeMode="contain"
                  />
                </View>

                {/* Log Details */}
                <View className="flex-1">
                  <View className="mb-2 flex-row items-start justify-between">
                    <Text className="text-xs font-medium text-stone-400">
                      {log.date}
                    </Text>
                  </View>

                  <View className="flex-row items-end justify-between">
                    <Text className="text-4xl font-bold tracking-tighter text-white">
                      {log.score}
                      <Text className="text-xl text-stone-500">%</Text>
                    </Text>

                    <View className="flex-row items-center gap-2">
                      {log.isUp ? (
                        <TrendingUp width={24} height={24} color="#4ADE80" />
                      ) : (
                        <TrendingDown width={24} height={24} color="#F87171" />
                      )}
                      <Text
                        className={`font-bold ${log.isUp ? 'text-green-400' : 'text-red-400'}`}
                      >
                        {log.trend}%
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </ScrollView>
    // </SafeAreaView>
  );
}
