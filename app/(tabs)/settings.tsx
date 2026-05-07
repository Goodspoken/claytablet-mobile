import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation, i18n } from '../../constants/i18n';
import { useThemeColor } from '../../constants/colors';
import { Storage } from '../../services/storage';
import { API } from '../../services/api';

interface UserInfo {
  id: string;
  name: string;
  email: string;
  picture?: string;
  provider: string;
}

export default function SettingsScreen() {
  const { t, locale } = useTranslation();
  const theme = useThemeColor();
  const router = useRouter();
  const [serverUrl, setServerUrl] = useState('');
  const [saved, setSaved] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    Storage.getServerUrl().then(setServerUrl);
    Storage.getUser().then(setUser);
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

  const handleLogout = async () => {
    try {
      const token = await Storage.getToken();
      if (token) {
        await API.logout(serverUrl, token);
      }
    } catch {
      // ignore logout API errors
    }
    await Storage.clearUser();
    setUser(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {user ? (
        <View style={[styles.userCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {user.picture ? (
            <Image source={{ uri: user.picture }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatarPlaceholder, { backgroundColor: theme.tint }]}>
              <Text style={styles.avatarInitial}>{(user.name || '?')[0].toUpperCase()}</Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.text }]} numberOfLines={1}>{user.name}</Text>
            <Text style={[styles.userEmail, { color: theme.tabIconDefault }]} numberOfLines={1}>{user.email}</Text>
            <Text style={[styles.userProvider, { color: theme.tabIconDefault }]}>{user.provider}</Text>
          </View>
          <TouchableOpacity
            style={[styles.logoutButton, { backgroundColor: theme.danger }]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>{t('logout') ?? 'Logout'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.signInButton, { backgroundColor: theme.tint }]}
          onPress={() => router.push('/auth')}
        >
          <Text style={styles.signInText}>{t('signIn') ?? 'Sign In'}</Text>
        </TouchableOpacity>
      )}

      <Text style={[styles.label, { color: theme.text, marginTop: 24 }]}>{t('server')}</Text>
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
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  avatarPlaceholder: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  avatarInitial: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  userInfo: { flex: 1 },
  userName: { fontSize: 15, fontWeight: '600' },
  userEmail: { fontSize: 13, marginTop: 2 },
  userProvider: { fontSize: 12, marginTop: 2 },
  logoutButton: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  logoutText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  signInButton: { height: 48, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  signInText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
