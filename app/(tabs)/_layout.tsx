import { Tabs } from 'expo-router';
import { useTranslation } from '../../constants/i18n';
import { useThemeColor } from '../../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const { t } = useTranslation();
  const theme = useThemeColor();

  return (
    <Tabs screenOptions={{
      tabBarActiveTintColor: theme.tabIconSelected,
      tabBarInactiveTintColor: theme.tabIconDefault,
      tabBarStyle: { backgroundColor: theme.card, borderTopColor: theme.border },
      headerStyle: { backgroundColor: theme.background },
      headerTintColor: theme.text,
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color }) => <Ionicons name="home" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color }) => <Ionicons name="settings" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
