export interface Task {
  id: string;
  name: string;
  durationSeconds: number;
  emoji: string;
  description: string;
}

export interface AppState {
  tasks: Task[];
  dailySecondsCompleted: number;
  dailyGoalMinutes: number;
  streakDays: number;
  lastCompletedDate: string | null;
  motivationalQuote: string;
}

export type AppAction =
  | { type: 'COMPLETE_TASK'; seconds: number }
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'DELETE_TASK'; id: string }
  | { type: 'SET_DAILY_GOAL'; minutes: number }
  | { type: 'LOAD_STATE'; state: AppState }
  | { type: 'RESET_DAILY' };