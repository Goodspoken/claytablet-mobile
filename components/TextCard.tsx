import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useTranslation } from '../constants/i18n';
import { useThemeColor } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';

export function TextCard({ content, onDelete }: { content: string; onDelete?: () => void }) {
  const { t } = useTranslation();
  const theme = useThemeColor();

  const handleCopy = async () => {
    await Clipboard.setStringAsync(content);
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Text style={[styles.text, { color: theme.text }]}>{content}</Text>
      <View style={styles.actions}>
        <TouchableOpacity onPress={handleCopy} style={styles.actionButton}>
          <Ionicons name="copy-outline" size={16} color={theme.tint} />
          <Text style={[styles.actionText, { color: theme.tint }]}>{t('copy')}</Text>
        </TouchableOpacity>
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={[styles.actionButton, { marginLeft: 12 }]}>
            <Ionicons name="trash-outline" size={16} color="#EF4444" />
            <Text style={[styles.actionText, { color: '#EF4444' }]}>{t('delete')}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 12,
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '500',
  }
});
