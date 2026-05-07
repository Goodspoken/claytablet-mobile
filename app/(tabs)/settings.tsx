import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useTranslation, i18n } from '../../constants/i18n';
import { useThemeColor } from '../../constants/colors';
import { Storage } from '../../services/storage';

export default function SettingsScreen() {
  const { t, locale } = useTranslation();
  const theme = useThemeColor();
  const [serverUrl, setServerUrl] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    Storage.getServerUrl().then(setServerUrl);
  }, []);

  const saveServer = async () => {
    await Storage.setServerUrl(serverUrl.trim() || 'https://claytablet.online');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleLanguage = () => {
    const next = locale === 'ru' ? 'en' : 'ru';
    i18n.setLocale(next);
    Storage.setLocale(next);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.label, { color: theme.text }]}>{t('server')}</Text>
      <TextInput
        style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
        value={serverUrl}
        onChangeText={setServerUrl}
        onBlur={saveServer}
        onSubmitEditing={saveServer}
        autoCapitalize="none"
        returnKeyType="done"
        placeholder="https://claytablet.online"
        placeholderTextColor={theme.tabIconDefault}
      />

      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: saved ? '#10B981' : theme.tint }]}
        onPress={saveServer}
      >
        <Text style={styles.saveButtonText}>{saved ? '✓ ' + t('save') : t('save')}</Text>
      </TouchableOpacity>

      <View style={[styles.row, { marginTop: 24 }]}>
        <Text style={[styles.label, { color: theme.text, marginBottom: 0 }]}>{t('language')} (RU/EN)</Text>
        <Switch value={locale === 'en'} onValueChange={toggleLanguage} trackColor={{ true: theme.tint }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  label: { fontSize: 16, marginBottom: 8, fontWeight: '500' },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, height: 48, fontSize: 16, marginBottom: 12 },
  saveButton: { height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }
});
