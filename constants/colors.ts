import { useColorScheme } from 'react-native';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#F9FAFB',
    card: '#FFFFFF',
    border: '#E5E7EB',
    tint: '#6366f1',
    tabIconDefault: '#687076',
    tabIconSelected: '#6366f1',
    danger: '#EF4444',
  },
  dark: {
    text: '#ECEDEE',
    background: '#11181C',
    card: '#1F2937',
    border: '#374151',
    tint: '#6366f1',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: '#6366f1',
    danger: '#F87171',
  },
};

export function useThemeColor() {
  const theme = useColorScheme() ?? 'light';
  return Colors[theme];
}
