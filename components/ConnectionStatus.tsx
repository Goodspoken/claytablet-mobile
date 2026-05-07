import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '../constants/i18n';
import { useThemeColor } from '../constants/colors';

export function ConnectionStatus({ status }: { status: 'online' | 'offline' | 'connecting' }) {
  const { t } = useTranslation();
  const theme = useThemeColor();
  
  const color = status === 'online' ? '#10B981' : status === 'offline' ? '#EF4444' : '#F59E0B';
  
  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color: theme.text }]}>{t(status)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  }
});
