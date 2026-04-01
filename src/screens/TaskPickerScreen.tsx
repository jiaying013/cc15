import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { COLORS, SIZES } from '../constants/theme';
import { useAppState } from '../store/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Task } from '../store/types';

type Nav = NativeStackNavigationProp<RootStackParamList, 'TaskPicker'>;

const DIFFICULTY_LABELS: Record<number, { label: string; color: string }> = {
  5: { label: 'Easy', color: COLORS.success },
  10: { label: 'Medium', color: COLORS.warning },
  15: { label: 'Hard', color: COLORS.danger },
  20: { label: 'Hard', color: COLORS.danger },
};

function getDifficulty(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  if (minutes <= 5) return DIFFICULTY_LABELS[5];
  if (minutes <= 10) return DIFFICULTY_LABELS[10];
  return DIFFICULTY_LABELS[15];
}

export default function TaskPickerScreen() {
  const navigation = useNavigation<Nav>();
  const { state } = useAppState();

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    return `${m} min`;
  };

  const renderTask = ({ item, index }: { item: Task; index: number }) => {
    const diff = getDifficulty(item.durationSeconds);
    return (
      <TouchableOpacity
        style={styles.taskCard}
        onPress={() => navigation.navigate('Timer', { taskId: item.id })}
        activeOpacity={0.75}
      >
        <View style={styles.taskLeft}>
          <View style={styles.emojiBadge}>
            <Text style={styles.emoji}>{item.emoji}</Text>
          </View>
          <View style={styles.taskMeta}>
            <Text style={styles.taskName}>{item.name}</Text>
            <Text style={styles.taskDesc}>{item.description}</Text>
          </View>
        </View>
        <View style={styles.taskRight}>
          <Text style={styles.duration}>{formatDuration(item.durationSeconds)}</Text>
          <View style={[styles.diffBadge, { borderColor: diff.color + '55' }]}>
            <Text style={[styles.diffText, { color: diff.color }]}>
              {diff.label}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.titleSection}>
        <Text style={styles.title}>Pick your Quest</Text>
        <Text style={styles.subtitle}>
          Complete one to earn {state.dailyGoalMinutes} minutes toward unlock
        </Text>
      </View>

      {/* Reward Info */}
      <View style={styles.rewardCard}>
        <Text style={styles.rewardIcon}>🔓</Text>
        <Text style={styles.rewardText}>
          Unlock reward: {state.dailyGoalMinutes} min of tasks = game access
        </Text>
      </View>

      <FlatList
        data={state.tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderTask}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: { paddingHorizontal: SIZES.padding, paddingTop: 16 },
  backBtn: { alignSelf: 'flex-start', padding: 4 },
  backText: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },

  titleSection: {
    paddingHorizontal: SIZES.padding,
    paddingTop: 16,
    paddingBottom: 16,
  },
  title: { fontSize: 30, fontWeight: '900', color: COLORS.text },
  subtitle: { fontSize: 14, color: COLORS.textSub, marginTop: 5, lineHeight: 20 },

  rewardCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SIZES.padding,
    marginBottom: 16,
    backgroundColor: '#1A1040',
    borderRadius: SIZES.radiusSm,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.primary + '44',
    gap: 10,
  },
  rewardIcon: { fontSize: 18 },
  rewardText: { flex: 1, fontSize: 13, color: COLORS.textSub, lineHeight: 18 },

  list: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
  },
  taskCard: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  taskLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 14 },
  emojiBadge: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: COLORS.bgAlt,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  emoji: { fontSize: 26 },
  taskMeta: { flex: 1 },
  taskName: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  taskDesc: { fontSize: 12, color: COLORS.textSub, marginTop: 3 },
  taskRight: { alignItems: 'flex-end', gap: 6 },
  duration: { fontSize: 14, fontWeight: '700', color: COLORS.text },
  diffBadge: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  diffText: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
});