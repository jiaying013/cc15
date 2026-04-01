import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, SIZES } from '../constants/theme';
import { useAppState } from '../store/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import CircularTimer from '../components/CircularTimer';

type Nav = NativeStackNavigationProp<RootStackParamList, 'Timer'>;
type Route = RouteProp<RootStackParamList, 'Timer'>;

const CHEERS = [
  "You've got this! 💪",
  'Halfway there. Keep it up.',
  'Real life achievements matter more.',
  'Your future self thanks you.',
  'This is the actual game.',
  'One step at a time.',
];

export default function TimerScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { state, dispatch } = useAppState();

  const task = state.tasks.find((t) => t.id === route.params.taskId);
  const totalSeconds = task?.durationSeconds ?? 300;

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(true);
  const [cheer] = useState(CHEERS[Math.floor(Math.random() * CHEERS.length)]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasCompleted = useRef(false);

  const handleComplete = useCallback(() => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;
    dispatch({ type: 'COMPLETE_TASK', seconds: totalSeconds });
    navigation.replace('Completion', {
      taskId: route.params.taskId,
      secondsCompleted: totalSeconds,
    });
  }, [totalSeconds, dispatch, navigation, route.params.taskId]);

  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          handleComplete();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, handleComplete]);

  const handleAbandon = () => {
    Alert.alert('Abandon Quest?', "Your progress won't be saved.", [
      { text: 'Keep Going', style: 'cancel' },
      {
        text: 'Abandon',
        style: 'destructive',
        onPress: () => {
          if (intervalRef.current) clearInterval(intervalRef.current);
          navigation.goBack();
        },
      },
    ]);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const progress = 1 - secondsLeft / totalSeconds;
  const progressPct = Math.round(progress * 100);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={handleAbandon} style={styles.quitBtn}>
            <Text style={styles.quitText}>✕ Quit</Text>
          </TouchableOpacity>
          <View style={styles.inProgressBadge}>
            <View style={[styles.dot, { backgroundColor: isRunning ? COLORS.success : COLORS.warning }]} />
            <Text style={styles.inProgressText}>
              {isRunning ? 'IN PROGRESS' : 'PAUSED'}
            </Text>
          </View>
        </View>

        {/* Task Info */}
        <View style={styles.taskInfo}>
          <Text style={styles.taskEmoji}>{task?.emoji}</Text>
          <Text style={styles.taskName}>{task?.name}</Text>
          <Text style={styles.cheerText}>{cheer}</Text>
        </View>

        {/* Circular Timer */}
        <View style={styles.timerContainer}>
          <CircularTimer progress={progress} size={250} strokeWidth={16} />
          <View style={styles.timerCenter}>
            <Text style={styles.timeDisplay}>{formatTime(secondsLeft)}</Text>
            <Text style={styles.remainingLabel}>remaining</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressSection}>
          <Text style={styles.progressLabel}>Progress</Text>
          <Text style={styles.progressPct}>{progressPct}%</Text>
        </View>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${progressPct}%`,
                backgroundColor:
                  progress < 0.5
                    ? COLORS.accent
                    : progress < 0.9
                    ? COLORS.primary
                    : COLORS.success,
              },
            ]}
          />
        </View>

        {/* Pause / Resume */}
        <TouchableOpacity
          style={styles.pauseBtn}
          onPress={() => setIsRunning((r) => !r)}
          activeOpacity={0.8}
        >
          <Text style={styles.pauseText}>
            {isRunning ? '⏸  Pause' : '▶  Resume'}
          </Text>
        </TouchableOpacity>

        {/* Abandon link */}
        <TouchableOpacity onPress={handleAbandon} style={styles.abandonBtn}>
          <Text style={styles.abandonText}>Abandon Quest</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: SIZES.padding, paddingBottom: 48 },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 36,
  },
  quitBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: SIZES.radiusSm,
    backgroundColor: COLORS.danger + '22',
    borderWidth: 1,
    borderColor: COLORS.danger + '44',
  },
  quitText: { fontSize: 14, color: COLORS.danger, fontWeight: '600' },
  inProgressBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 7,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  inProgressText: {
    fontSize: 11,
    color: COLORS.textSub,
    fontWeight: '700',
    letterSpacing: 1,
  },

  taskInfo: { alignItems: 'center', marginBottom: 36 },
  taskEmoji: { fontSize: 52, marginBottom: 14 },
  taskName: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.text,
    textAlign: 'center',
  },
  cheerText: {
    fontSize: 14,
    color: COLORS.textSub,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },

  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 36,
    position: 'relative',
  },
  timerCenter: { position: 'absolute', alignItems: 'center' },
  timeDisplay: {
    fontSize: 56,
    fontWeight: '900',
    color: COLORS.text,
    letterSpacing: 3,
    fontVariant: ['tabular-nums'],
  },
  remainingLabel: { fontSize: 13, color: COLORS.textSub, marginTop: 4 },

  progressSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: { fontSize: 13, color: COLORS.textSub },
  progressPct: { fontSize: 13, fontWeight: '700', color: COLORS.primaryGlow },
  progressTrack: {
    height: 6,
    backgroundColor: COLORS.card,
    borderRadius: 3,
    marginBottom: 32,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', borderRadius: 3 },

  pauseBtn: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 18,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.borderBright,
  },
  pauseText: { fontSize: 16, color: COLORS.text, fontWeight: '700' },

  abandonBtn: { alignItems: 'center', padding: 14 },
  abandonText: { fontSize: 14, color: COLORS.danger + 'AA', fontWeight: '500' },
});