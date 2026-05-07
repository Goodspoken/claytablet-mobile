import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from '../constants/i18n';
import { useThemeColor } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const { t } = useTranslation();
  const theme = useThemeColor();
  const router = useRouter();

  const handleOAuth = async (provider: 'google' | 'yandex') => {
    // TODO: Implement OAuth logic
    alert(`OAuth for ${provider} not implemented yet`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Sign In</Text>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#fff', borderColor: '#e5e7eb', borderWidth: 1 }]} 
        onPress={() => handleOAuth('google')}
      >
        <Ionicons name="logo-google" size={24} color="#DB4437" />
        <Text style={[styles.buttonText, { color: '#000' }]}>{t('signInGoogle')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.button, { backgroundColor: '#fc3f1d' }]} 
        onPress={() => handleOAuth('yandex')}
      >
        <Text style={[styles.buttonText, { color: '#fff', marginLeft: 0 }]}>{t('signInYandex')}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.cancelButton} 
        onPress={() => router.back()}
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
  cancelText: { fontSize: 16 }
});
