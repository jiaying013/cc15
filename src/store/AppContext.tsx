import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppAction, Task } from './types';

const DEFAULT_TASKS: Task[] = [
  {
    id: '1',
    name: 'Take a Walk',
    durationSeconds: 15 * 60,
    emoji: '🚶',
    description: 'Step outside for 15 minutes',
  },
  {
    id: '2',
    name: 'Clean Your Space',
    durationSeconds: 15 * 60,
    emoji: '🧹',
    description: 'Tidy up the area around you',
  },
  {
    id: '3',
    name: 'Drink Water',
    durationSeconds: 5 * 60,
    emoji: '💧',
    description: 'Hydrate properly — full glass',
  },
  {
    id: '4',
    name: '20 Push-ups',
    durationSeconds: 5 * 60,
    emoji: '💪',
    description: 'Drop and give 20',
  },
  {
    id: '5',
    name: 'Read a Page',
    durationSeconds: 10 * 60,
    emoji: '📖',
    description: 'Read anything real for 10 min',
  },
];

const QUOTES = [
  'Your grandma misses you. Call her.',
  'Real life has better graphics.',
  'Touch grass. It is free.',
  'The outside quest is harder and more rewarding.',
  'Level up in real life first.',
  'You will not even remember this session tomorrow.',
  'One quest outside. Then decide.',
];

const initialState: AppState = {
  tasks: DEFAULT_TASKS,
  dailySecondsCompleted: 0,
  dailyGoalMinutes: 30,
  streakDays: 0,
  lastCompletedDate: null,
  motivationalQuote: QUOTES[0],
};

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'COMPLETE_TASK':
      return {
        ...state,
        dailySecondsCompleted: state.dailySecondsCompleted + action.seconds,
        lastCompletedDate: new Date().toDateString(),
        streakDays:
          state.lastCompletedDate === new Date().toDateString()
            ? state.streakDays
            : state.streakDays + 1,
        motivationalQuote: QUOTES[Math.floor(Math.random() * QUOTES.length)],
      };
    case 'ADD_TASK':
      return { ...state, tasks: [...state.tasks, action.task] };
    case 'DELETE_TASK':
      return { ...state, tasks: state.tasks.filter((t) => t.id !== action.id) };
    case 'SET_DAILY_GOAL':
      return { ...state, dailyGoalMinutes: action.minutes };
    case 'LOAD_STATE':
      return action.state;
    case 'RESET_DAILY':
      return { ...state, dailySecondsCompleted: 0 };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({ state: initialState, dispatch: () => {} });

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load from storage on app open
  useEffect(() => {
    AsyncStorage.getItem('breakquest_state').then((data) => {
      if (data) {
        const saved = JSON.parse(data) as AppState;
        // Reset daily progress if it's a new day
        if (saved.lastCompletedDate !== new Date().toDateString()) {
          saved.dailySecondsCompleted = 0;
        }
        dispatch({ type: 'LOAD_STATE', state: saved });
      }
    });
  }, []);

  // Save on every state change
  useEffect(() => {
    AsyncStorage.setItem('breakquest_state', JSON.stringify(state));
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppState = () => useContext(AppContext);