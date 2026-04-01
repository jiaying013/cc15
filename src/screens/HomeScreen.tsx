import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, SIZES } from '../constants/theme';
import { useAppState } from '../store/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import ProgressRing from '../components/ProgressRing';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Home'>;

export default function HomeScreen() {
  const navigation = useNavigation<Nav>();
  const { state } = useAppState();

  const goalSeconds = state.dailyGoalMinutes * 60;
  const progress = Math.min(state.dailySecondsCompleted / goalSeconds, 1);
  const minutesDone = Math.floor(state.dailySecondsCompleted / 60);
  const isUnlocked = progress >= 1;
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.appName}>BreakQuest</Text>
            <Text style={styles.dateText}>{today}</Text>
          </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={styles.settingsBtn}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Status Banner */}
        <View
          style={[
            styles.statusBanner,
            isUnlocked ? styles.statusBannerUnlocked : styles.statusBannerLocked,
          ]}
        >
          <Text style={styles.statusIcon}>{isUnlocked ? '🔓' : '🔒'}</Text>
          <View style={styles.statusText}>
            <Text
              style={[
                styles.statusTitle,
                { color: isUnlocked ? COLORS.success : COLORS.text },
              ]}
            >
              {isUnlocked ? 'Game Unlocked' : 'Game Locked'}
            </Text>
            <Text style={styles.statusSub}>
              {isUnlocked
                ? 'Daily goal hit. You earned it.'
                : `${state.dailyGoalMinutes - minutesDone} min left to unlock`}
            </Text>
          </View>
        </View>

        {/* Progress Ring */}
        <View style={styles.ringWrapper}>
          <ProgressRing progress={progress} size={220} strokeWidth={14} />
          <View style={styles.ringCenter}>
            <Text style={styles.ringMinutes}>{minutesDone}</Text>
            <Text style={styles.ringOf}>of {state.dailyGoalMinutes} min</Text>
            <View style={styles.percentPill}>
              <Text style={styles.percentText}>{Math.round(progress * 100)}%</Text>
            </View>
          </View>
        </View>

        {/* Quote Card */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteBar}>|</Text>
          <Text style={styles.quoteText}>"{state.motivationalQuote}"</Text>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statValue}>{state.streakDays}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⚔️</Text>
            <Text style={styles.statValue}>{state.tasks.length}</Text>
            <Text style={styles.statLabel}>Quests</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⏱</Text>
            <Text style={styles.statValue}>{minutesDone}m</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
        </View>

        {/* Main CTA */}
        {!isUnlocked ? (
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation.navigate('TaskPicker')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaText}>⚔️  Choose a Quest</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.unlockedCard}>
            <Text style={styles.unlockedEmoji}>🎮</Text>
            <Text style={styles.unlockedTitle}>Go game.</Text>
            <Text style={styles.unlockedSub}>
              But maybe you won't even want to now.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: SIZES.padding, paddingBottom: 48 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  appName: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 0.5,
  },
  dateText: { fontSize: 12, color: COLORS.textSub, marginTop: 3 },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  settingsIcon: { fontSize: 20 },

  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    gap: 14,
  },
  statusBannerLocked: {
    backgroundColor: '#110D2A',
    borderColor: COLORS.primary,
  },
  statusBannerUnlocked: {
    backgroundColor: '#0A2318',
    borderColor: COLORS.success,
  },
  statusIcon: { fontSize: 28 },
  statusText: { flex: 1 },
  statusTitle: { fontSize: 17, fontWeight: '800' },
  statusSub: { fontSize: 13, color: COLORS.textSub, marginTop: 3 },

  ringWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  ringCenter: {
    position: 'absolute',
    alignItems: 'center',
  },
  ringMinutes: {
    fontSize: 52,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: -2,
  },
  ringOf: { fontSize: 13, color: COLORS.textSub },
  percentPill: {
    marginTop: 6,
    backgroundColor: COLORS.primary + '33',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary + '66',
  },
  percentText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryGlow,
  },

  quoteCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 10,
  },
  quoteBar: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '900',
    marginTop: 1,
  },
  quoteText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSub,
    fontStyle: 'italic',
    lineHeight: 22,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statEmoji: { fontSize: 20, marginBottom: 6 },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 3,
  },
  statLabel: { fontSize: 11, color: COLORS.textSub, letterSpacing: 0.5 },

  ctaButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: 20,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 0.5,
  },

  unlockedCard: {
    backgroundColor: '#0A2318',
    borderRadius: SIZES.radius,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.success,
  },
  unlockedEmoji: { fontSize: 40, marginBottom: 10 },
  unlockedTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.success,
    marginBottom: 6,
  },
  unlockedSub: {
    fontSize: 14,
    color: COLORS.textSub,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});