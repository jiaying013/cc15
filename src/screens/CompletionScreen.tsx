import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, SIZES } from '../constants/theme';
import { useAppState } from '../store/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Completion'>;
type Route = RouteProp<RootStackParamList, 'Completion'>;

export default function CompletionScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { state } = useAppState();

  const task = state.tasks.find((t) => t.id === route.params.taskId);
  const minutesEarned = Math.floor(route.params.secondsCompleted / 60);
  const totalMinutes = Math.floor(state.dailySecondsCompleted / 60);
  const goalMinutes = state.dailyGoalMinutes;
  const isFullyUnlocked = state.dailySecondsCompleted >= goalMinutes * 60;
  const remaining = Math.max(goalMinutes - totalMinutes, 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Trophy */}
        <View style={styles.trophyContainer}>
          <View style={styles.trophyRing}>
            <Text style={styles.trophyEmoji}>🏆</Text>
          </View>
          <View style={styles.confettiRow}>
            {['🎉', '✨', '⭐', '✨', '🎉'].map((e, i) => (
              <Text key={i} style={styles.confettiEmoji}>{e}</Text>
            ))}
          </View>
        </View>

        <Text style={styles.title}>Quest Complete!</Text>
        <Text style={styles.taskName}>
          {task?.emoji}  {task?.name}
        </Text>

        {/* Earned Card */}
        <View style={styles.earnedCard}>
          <View style={styles.earnedRow}>
            <Text style={styles.earnedLabel}>Time Completed</Text>
            <Text style={styles.earnedValue}>{minutesEarned} min</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.earnedRow}>
            <Text style={styles.earnedLabel}>Daily Total</Text>
            <Text style={styles.earnedValue}>
              {totalMinutes} / {goalMinutes} min
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.earnedRow}>
            <Text style={styles.earnedLabel}>Streak</Text>
            <Text style={styles.earnedValue}>🔥 {state.streakDays} days</Text>
          </View>
        </View>

        {/* Unlock Status */}
        {isFullyUnlocked ? (
          <View style={styles.unlockedCard}>
            <Text style={styles.unlockedBig}>🔓</Text>
            <Text style={styles.unlockedTitle}>Game Unlocked</Text>
            <Text style={styles.unlockedSub}>
              Daily goal reached. You've earned it.
            </Text>
          </View>
        ) : (
          <View style={styles.lockedCard}>
            <Text style={styles.lockedTitle}>
              {remaining} min left to unlock
            </Text>
            <View style={styles.lockedBar}>
              <View
                style={[
                  styles.lockedFill,
                  { width: `${Math.min((totalMinutes / goalMinutes) * 100, 100)}%` },
                ]}
              />
            </View>
          </View>
        )}

        {/* Gentle nudge */}
        <Text style={styles.nudge}>
          Now that you've done that... do you still feel like gaming? 😏
        </Text>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={styles.buttonArea}>
        {!isFullyUnlocked && (
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => navigation.navigate('TaskPicker')}
          >
            <Text style={styles.primaryBtnText}>⚔️  Another Quest</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.secondaryBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: {
    padding: SIZES.padding,
    paddingBottom: 20,
    alignItems: 'center',
  },

  trophyContainer: { alignItems: 'center', marginTop: 24, marginBottom: 20 },
  trophyRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#1A1040',
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  trophyEmoji: { fontSize: 52 },
  confettiRow: { flexDirection: 'row', marginTop: 12, gap: 6 },
  confettiEmoji: { fontSize: 18 },

  title: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  taskName: {
    fontSize: 18,
    color: COLORS.textSub,
    marginBottom: 28,
    textAlign: 'center',
  },

  earnedCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 20,
    width: '100%',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  earnedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earnedLabel: { fontSize: 14, color: COLORS.textSub },
  earnedValue: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 14,
  },

  unlockedCard: {
    backgroundColor: '#0A2318',
    borderRadius: SIZES.radius,
    padding: 24,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.success,
    marginBottom: 20,
  },
  unlockedBig: { fontSize: 40, marginBottom: 8 },
  unlockedTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.success,
    marginBottom: 4,
  },
  unlockedSub: { fontSize: 13, color: COLORS.textSub, textAlign: 'center' },

  lockedCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 18,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 20,
  },
  lockedTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.warning,
    marginBottom: 12,
    textAlign: 'center',
  },
  lockedBar: {
    height: 6,
    backgroundColor: COLORS.bg,
    borderRadius: 3,
    overflow: 'hidden',
  },
  lockedFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },

  nudge: {
    fontSize: 14,
    color: COLORS.textSub,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingHorizontal: 20,
    lineHeight: 22,
  },

  buttonArea: {
    padding: SIZES.padding,
    gap: 12,
  },
  primaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radius,
    padding: 18,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 8,
  },
  primaryBtnText: { fontSize: 17, fontWeight: '900', color: '#fff' },
  secondaryBtn: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  secondaryBtnText: { fontSize: 16, color: COLORS.textSub, fontWeight: '600' },
});