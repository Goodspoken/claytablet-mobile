import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '../constants/i18n';
import { useThemeColor } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { Storage } from '../services/storage';

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const { t } = useTranslation();
  const theme = useThemeColor();
  const router = useRouter();
  const [loading, setLoading] = useState<'google' | 'yandex' | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleOAuth = async (provider: 'google' | 'yandex') => {
    setErrorMsg(null);
    setLoading(provider);
    try {
      const serverUrl = await Storage.getServerUrl();
      const loginUrl = `${serverUrl}/api/auth/${provider}/login/mobile`;

      const result = await WebBrowser.openAuthSessionAsync(loginUrl, 'claytablet://auth');

      if (result.type === 'success' && result.url) {
        const parsed = new URL(result.url);
        const token = parsed.searchParams.get('token');
        const error = parsed.searchParams.get('error');

        if (token) {
          await Storage.setToken(token);
          try {
            const res = await fetch(`${serverUrl}/api/auth/me`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              const user = await res.json();
              await Storage.setUser(user);
            }
          } catch {
            // user info fetch failed, token still saved
          }
          router.replace('/');
        } else if (error) {
          setErrorMsg('OAuth failed: ' + error);
        }
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(null);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Sign In</Text>

      {errorMsg && (
        <View style={[styles.errorBox, { backgroundColor: theme.danger + '22', borderColor: theme.danger }]}>
          <Text style={[styles.errorText, { color: theme.danger }]}>{errorMsg}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#fff', borderColor: '#e5e7eb', borderWidth: 1, opacity: loading ? 0.6 : 1 }]}
        onPress={() => handleOAuth('google')}
        disabled={loading !== null}
      >
        {loading === 'google' ? (
          <ActivityIndicator size="small" color="#DB4437" />
        ) : (
          <Ionicons name="logo-google" size={24} color="#DB4437" />
        )}
        <Text style={[styles.buttonText, { color: '#000' }]}>{t('signInGoogle')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#fc3f1d', opacity: loading ? 0.6 : 1 }]}
        onPress={() => handleOAuth('yandex')}
        disabled={loading !== null}
      >
        {loading === 'yandex' ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : null}
        <Text style={[styles.buttonText, { color: '#fff', marginLeft: loading === 'yandex' ? 12 : 0 }]}>{t('signInYandex')}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => router.back()}
        disabled={loading !== null}
      >
        <Text style={[styles.cancelText, { color: theme.tabIconDefault }]}>{t('cancel')}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
  button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', height: 56, borderRadius: 12, marginBottom: 16 },
  buttonText: { fontSize: 16, fontWeight: '600', marginLeft: 12 },
  cancelButton: { marginTop: 16, alignItems: 'center' },
  cancelText: { fontSize: 16 },
  errorBox: { borderWidth: 1, borderRadius: 8, padding: 12, marginBottom: 16 },
  errorText: { fontSize: 14, textAlign: 'center' }
});
