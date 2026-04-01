import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../constants/theme';
import HomeScreen from '../screens/HomeScreen';
import TaskPickerScreen from '../screens/TaskPickerScreen';
import TimerScreen from '../screens/TimerScreen';
import CompletionScreen from '../screens/CompletionScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type RootStackParamList = {
  Home: undefined;
  TaskPicker: undefined;
  Timer: { taskId: string };
  Completion: { taskId: string; secondsCompleted: number };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: COLORS.bg },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="TaskPicker" component={TaskPickerScreen} />
        <Stack.Screen name="Timer" component={TimerScreen} />
        <Stack.Screen name="Completion" component={CompletionScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}