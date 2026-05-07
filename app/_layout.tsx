import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useThemeColor } from '../constants/colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const theme = useThemeColor();

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: theme.background }}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ 
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        contentStyle: { backgroundColor: theme.background }
      }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="[roomId]/index" options={{ headerShown: true, title: 'Room' }} />
        <Stack.Screen name="auth" options={{ presentation: 'modal', title: 'Sign In' }} />
      </Stack>
    </GestureHandlerRootView>
  );
}
