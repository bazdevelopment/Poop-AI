import { useLocalSearchParams, useRouter } from 'expo-router';
import * as React from 'react';
import { Dimensions, ScrollView, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { SafeAreaView, Text } from '@/components/ui';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const BAR_H = 30;
const BAR_RADIUS = 15;
const BAR_WIDTH = SCREEN_WIDTH - 40;

// ─── Gut state config (0–100%) ────────────────────────────────────────────────

const GUT_STATES = [
  {
    id: 'optimal',
    label: 'Optimal',
    range: '78% – 100%',
    color: '#4ADE80',
    bgColor: 'rgba(74,222,128,0.10)',
    borderColor: 'rgba(74,222,128,0.28)',
    description:
      'You may feel energized, resilient & clear. You are in peak gut state.',
  },
  {
    id: 'sufficient',
    label: 'Sufficient',
    range: '65% – 77%',
    color: '#FBBF24',
    bgColor: 'rgba(251,191,36,0.10)',
    borderColor: 'rgba(251,191,36,0.28)',
    description:
      'You may feel balanced but mild dips or sluggishness may appear at times.',
  },
  {
    id: 'poor',
    label: 'Poor',
    range: '0% – 64%',
    color: '#F87171',
    bgColor: 'rgba(248,113,113,0.10)',
    borderColor: 'rgba(248,113,113,0.28)',
    description:
      'You may feel stressed, drained & foggy. Your body may be more sensitive & reactive.',
  },
];

const INFLUENCES = [
  {
    icon: '🥗',
    title: 'Diet & Nutrition',
    desc: 'Fiber and fermented foods feed beneficial bacteria.',
  },
  {
    icon: '😴',
    title: 'Sleep Quality',
    desc: 'Poor sleep disrupts your gut microbiome rhythm.',
  },
  {
    icon: '🧘',
    title: 'Stress Levels',
    desc: 'Chronic stress shifts microbial composition.',
  },
  {
    icon: '🏃',
    title: 'Physical Activity',
    desc: 'Movement promotes microbial diversity.',
  },
  {
    icon: '💊',
    title: 'Medications',
    desc: 'Antibiotics can deplete gut flora significantly.',
  },
  {
    icon: '💧',
    title: 'Hydration',
    desc: 'Water supports the mucosal lining and digestion.',
  },
];

// ─── Horizontal Score Bar ─────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  const clamped = Math.min(Math.max(score, 0), 100);
  const rawX = (clamped / 100) * BAR_WIDTH;
  const MARGIN = 16;
  const tipX = Math.min(Math.max(rawX, MARGIN), BAR_WIDTH - MARGIN);

  const above = clamped >= 50;
  const labelText = `Your score (${clamped}%)`;
  const LABEL_W = labelText.length * 7.5;
  const labelLeft = Math.min(
    Math.max(tipX - LABEL_W / 2, 0),
    BAR_WIDTH - LABEL_W,
  );

  return (
    <View style={{ width: BAR_WIDTH, alignSelf: 'center' }}>
      {above && (
        <View
          style={{
            position: 'absolute',
            top: -28,
            left: labelLeft,
            width: LABEL_W,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: '700',
              letterSpacing: 0.3,
            }}
            numberOfLines={1}
          >
            {labelText}
          </Text>
        </View>
      )}

      <Svg width={BAR_WIDTH} height={BAR_H}>
        <Defs>
          <LinearGradient id="gutGrad" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor="#DC2626" />
            <Stop offset="0.32" stopColor="#F97316" />
            <Stop offset="0.58" stopColor="#FBBF24" />
            <Stop offset="0.78" stopColor="#A3E635" />
            <Stop offset="1" stopColor="#4ADE80" />
          </LinearGradient>
        </Defs>
        <Rect
          x={0}
          y={0}
          width={BAR_WIDTH}
          height={BAR_H}
          rx={BAR_RADIUS}
          ry={BAR_RADIUS}
          fill="url(#gutGrad)"
        />
      </Svg>

      {above ? (
        <View
          style={{
            position: 'absolute',
            top: BAR_H - 2,
            left: tipX - 11,
            width: 0,
            height: 0,
            borderLeftWidth: 11,
            borderRightWidth: 11,
            borderTopWidth: 14,
            borderStyle: 'solid',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderTopColor: '#FFFFFF',
          }}
        />
      ) : (
        <View
          style={{
            position: 'absolute',
            top: -12,
            left: tipX - 11,
            width: 0,
            height: 0,
            borderLeftWidth: 11,
            borderRightWidth: 11,
            borderBottomWidth: 14,
            borderStyle: 'solid',
            borderLeftColor: 'transparent',
            borderRightColor: 'transparent',
            borderBottomColor: '#FFFFFF',
          }}
        />
      )}

      {!above && (
        <View
          style={{
            position: 'absolute',
            top: BAR_H + 8,
            left: labelLeft,
            width: LABEL_W,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 12,
              fontWeight: '700',
              letterSpacing: 0.3,
            }}
            numberOfLines={1}
          >
            {labelText}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Range Card ───────────────────────────────────────────────────────────────

function RangeCard({ state }: { state: (typeof GUT_STATES)[0] }) {
  return (
    <View
      style={{
        backgroundColor: state.bgColor,
        borderColor: state.borderColor,
        borderWidth: 1,
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
      }}
    >
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
      >
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: state.color,
            marginRight: 8,
          }}
        />
        <Text
          style={{
            color: state.color,
            fontWeight: '700',
            fontSize: 15,
            letterSpacing: 0.3,
          }}
        >
          {state.label}
        </Text>
        <View style={{ flex: 1 }} />
        <View
          style={{
            backgroundColor: 'rgba(255,255,255,0.07)',
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 3,
          }}
        >
          <Text style={{ color: state.color, fontSize: 12, fontWeight: '600' }}>
            {state.range}
          </Text>
        </View>
      </View>
      <Text style={{ color: '#D6C9B8', fontSize: 14, lineHeight: 21 }}>
        {state.description}
      </Text>
    </View>
  );
}

// ─── Influence Card ───────────────────────────────────────────────────────────

function InfluenceCard({ item }: { item: (typeof INFLUENCES)[0] }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(255,255,255,0.04)',
        borderColor: 'rgba(255,255,255,0.08)',
        borderWidth: 1,
        borderRadius: 18,
        padding: 14,
        margin: 5,
      }}
    >
      <Text style={{ fontSize: 26, marginBottom: 8, paddingTop: 5 }}>
        {item.icon}
      </Text>
      <Text
        style={{
          color: '#FFFFFF',
          fontWeight: '700',
          fontSize: 13,
          marginBottom: 4,
        }}
      >
        {item.title}
      </Text>
      <Text style={{ color: '#9C8F82', fontSize: 12, lineHeight: 17 }}>
        {item.desc}
      </Text>
    </View>
  );
}

// ─── Scan Button (Floating) ───────────────────────────────────────────────────

function ScanButton({ onPress }: { onPress: () => void }) {
  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        // Frosted dark fade so the button feels anchored, not floating in space
        paddingTop: 20,
        paddingBottom: 36,
        paddingHorizontal: 20,
        backgroundColor: 'rgba(28,20,16,0.92)',
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.06)',
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.85}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          backgroundColor: '#C8692A', // warm amber-brown — on-brand with the dark gut theme
          borderRadius: 18,
          paddingVertical: 16,
          // Glow shadow
          shadowColor: '#F97316',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.45,
          shadowRadius: 16,
          elevation: 10,
        }}
      >
        {/* Poop emoji acts as the icon — instantly communicates the action */}
        <Text style={{ fontSize: 22, lineHeight: 26 }}>💩</Text>
        <Text
          style={{
            color: '#FFFFFF',
            fontSize: 16,
            fontWeight: '800',
            letterSpacing: 0.4,
          }}
        >
          Scan Poop
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────

function GutStatesScreen() {
  const router = useRouter();
  const { score: scoreParam } = useLocalSearchParams<{ score: string }>();
  const score = Math.round(Number(scoreParam));

  const handleScan = () => {
    // Navigate to your scan screen — adjust the route to match your file structure
    router.push('/scan');
  };

  return (
    // Outer wrapper to allow absolute positioning of the FAB
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* Extra bottom padding so content isn't hidden behind the sticky button */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 20,
              paddingTop: 16,
              paddingBottom: 28,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.08)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 14,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 18, lineHeight: 20 }}>
                ←
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 26,
                fontWeight: '800',
                letterSpacing: -0.5,
              }}
            >
              Gut Score
            </Text>
          </View>

          {/* Score bar */}
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 32,
              paddingBottom: 52,
              marginBottom: 8,
            }}
          >
            <ScoreBar score={score} />
          </View>

          {/* State cards */}
          <View style={{ paddingHorizontal: 20, marginBottom: 32 }}>
            {GUT_STATES.map((s) => (
              <RangeCard key={s.id} state={s} />
            ))}
          </View>

          {/* Influences */}
          <View style={{ paddingHorizontal: 20 }}>
            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 22,
                fontWeight: '800',
                letterSpacing: -0.4,
                marginBottom: 16,
              }}
            >
              How is your Gut
              {'\n'}
              Influenced?
            </Text>
            <View
              style={{ flexDirection: 'row', flexWrap: 'wrap', margin: -5 }}
            >
              {INFLUENCES.map((item) => (
                <View key={item.title} style={{ width: '50%' }}>
                  <InfluenceCard item={item} />
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Sticky scan button — lives outside ScrollView so it never scrolls away */}
      <ScanButton onPress={handleScan} />
    </View>
  );
}

export default GutStatesScreen;
