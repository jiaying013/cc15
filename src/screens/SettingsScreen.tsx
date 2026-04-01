import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SIZES } from '../constants/theme';
import { useAppState } from '../store/AppContext';
import { Task } from '../store/types';

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={sStyles.wrap}>
      <Text style={sStyles.title}>{title}</Text>
      <View style={sStyles.card}>{children}</View>
    </View>
  );
}

const sStyles = StyleSheet.create({
  wrap: { marginBottom: 28 },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textSub,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 10,
    paddingLeft: 4,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default function SettingsScreen() {
  const navigation = useNavigation();
  const { state, dispatch } = useAppState();
  const [goalInput, setGoalInput] = useState(state.dailyGoalMinutes.toString());
  const [newName, setNewName] = useState('');
  const [newDuration, setNewDuration] = useState('');
  const [newEmoji, setNewEmoji] = useState('⭐');

  const handleSaveGoal = () => {
    const val = parseInt(goalInput);
    if (!isNaN(val) && val > 0 && val <= 240) {
      dispatch({ type: 'SET_DAILY_GOAL', minutes: val });
      Alert.alert('Saved', `Daily goal set to ${val} minutes.`);
    } else {
      Alert.alert('Invalid', 'Enter a number between 1 and 240.');
    }
  };

  const handleAddTask = () => {
    if (!newName.trim() || !newDuration.trim()) {
      Alert.alert('Missing Info', 'Please fill in the quest name and duration.');
      return;
    }
    const mins = parseInt(newDuration);
    if (isNaN(mins) || mins <= 0) {
      Alert.alert('Invalid Duration', 'Enter a valid number of minutes.');
      return;
    }
    const task: Task = {
      id: Date.now().toString(),
      name: newName.trim(),
      durationSeconds: mins * 60,
      emoji: newEmoji || '⭐',
      description: `${mins} minute task`,
    };
    dispatch({ type: 'ADD_TASK', task });
    setNewName('');
    setNewDuration('');
    setNewEmoji('⭐');
  };

  const handleDeleteTask = (id: string, name: string) => {
    Alert.alert(`Delete "${name}"?`, 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => dispatch({ type: 'DELETE_TASK', id }),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Settings</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Daily Goal */}
        <Section title="🎯 Daily Goal">
          <Text style={styles.label}>
            Minutes of tasks required to unlock game
          </Text>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={goalInput}
              onChangeText={setGoalInput}
              keyboardType="numeric"
              placeholderTextColor={COLORS.textSub}
              selectionColor={COLORS.primary}
            />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveGoal}>
              <Text style={styles.saveBtnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </Section>

        {/* Quest List */}
        <Section title="⚔️ Active Quests">
          {state.tasks.map((task, index) => (
            <View key={task.id}>
              <View style={styles.taskRow}>
                <Text style={styles.taskEmoji}>{task.emoji}</Text>
                <View style={styles.taskInfo}>
                  <Text style={styles.taskName}>{task.name}</Text>
                  <Text style={styles.taskDur}>
                    {Math.floor(task.durationSeconds / 60)} min
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => handleDeleteTask(task.id, task.name)}
                  style={styles.deleteBtn}
                >
                  <Text style={styles.deleteText}>🗑</Text>
                </TouchableOpacity>
              </View>
              {index < state.tasks.length - 1 && (
                <View style={styles.rowDivider} />
              )}
            </View>
          ))}

          {/* Add New Quest */}
          <View style={styles.addSection}>
            <Text style={styles.addLabel}>Add a Quest</Text>
            <View style={styles.addRow}>
              <TextInput
                style={[styles.input, styles.emojiInput]}
                value={newEmoji}
                onChangeText={setNewEmoji}
                placeholderTextColor={COLORS.textSub}
                maxLength={2}
              />
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Quest name"
                value={newName}
                onChangeText={setNewName}
                placeholderTextColor={COLORS.textSub}
                selectionColor={COLORS.primary}
              />
              <TextInput
                style={[styles.input, styles.durationInput]}
                placeholder="min"
                value={newDuration}
                onChangeText={setNewDuration}
                keyboardType="numeric"
                placeholderTextColor={COLORS.textSub}
                selectionColor={COLORS.primary}
              />
            </View>
            <TouchableOpacity style={styles.addBtn} onPress={handleAddTask}>
              <Text style={styles.addBtnText}>+ Add Quest</Text>
            </TouchableOpacity>
          </View>
        </Section>

        {/* Danger Zone */}
        <Section title="⚠️ Danger Zone">
          <TouchableOpacity
            style={styles.dangerBtn}
            onPress={() =>
              Alert.alert(
                "Reset Today's Progress?",
                'This will clear all minutes earned today.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: () => dispatch({ type: 'RESET_DAILY' }),
                  },
                ]
              )
            }
          >
            <Text style={styles.dangerText}>Reset Today's Progress</Text>
          </TouchableOpacity>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { padding: SIZES.padding, paddingBottom: 60 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  backText: { fontSize: 16, color: COLORS.primary, fontWeight: '600' },
  pageTitle: { fontSize: 20, fontWeight: '900', color: COLORS.text },

  label: { fontSize: 13, color: COLORS.textSub, marginBottom: 12, lineHeight: 18 },
  row: { flexDirection: 'row', gap: 10, alignItems: 'center' },
  input: {
    backgroundColor: COLORS.bg,
    borderRadius: SIZES.radiusSm,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    color: COLORS.text,
    fontSize: 15,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusSm,
    paddingHorizontal: 20,
    paddingVertical: 13,
  },
  saveBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },

  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  taskEmoji: { fontSize: 24, width: 32, textAlign: 'center' },
  taskInfo: { flex: 1 },
  taskName: { fontSize: 15, fontWeight: '600', color: COLORS.text },
  taskDur: { fontSize: 12, color: COLORS.textSub, marginTop: 2 },
  deleteBtn: { padding: 6 },
  deleteText: { fontSize: 18 },
  rowDivider: { height: 1, backgroundColor: COLORS.border },

  addSection: { marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
  addLabel: { fontSize: 14, fontWeight: '700', color: COLORS.text, marginBottom: 10 },
  addRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  emojiInput: { width: 50, textAlign: 'center' },
  durationInput: { width: 65, textAlign: 'center' },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusSm,
    padding: 14,
    alignItems: 'center',
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  dangerBtn: {
    backgroundColor: COLORS.danger + '18',
    borderRadius: SIZES.radiusSm,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.danger + '44',
  },
  dangerText: { color: COLORS.danger, fontWeight: '600', fontSize: 15 },
});