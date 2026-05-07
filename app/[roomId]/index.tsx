import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Alert, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useRoom, RoomItem } from '../../hooks/useRoom';
import { useClipboard } from '../../hooks/useClipboard';
import { useTranslation } from '../../constants/i18n';
import { useThemeColor } from '../../constants/colors';
import { TextCard } from '../../components/TextCard';
import { ImageCard } from '../../components/ImageCard';
import { AudioCard } from '../../components/AudioCard';
import { BottomBar } from '../../components/BottomBar';
import { ConnectionStatus } from '../../components/ConnectionStatus';

export default function BoardScreen() {
  const { roomId } = useLocalSearchParams<{ roomId: string }>();
  const { t } = useTranslation();
  const theme = useThemeColor();
  const { items, loading, error, wsStatus, fetchRoom, addItem, deleteItem, setPassword, requiresPassword } = useRoom(roomId || '');
  const { clipboardContent, clearClipboardContent } = useClipboard();
  const flatListRef = useRef<FlatList>(null);
  const [passwordInput, setPasswordInput] = useState('');

  useEffect(() => {
    if (clipboardContent) {
      Alert.alert(
        t('clipboardDetect'),
        clipboardContent.substring(0, 50) + (clipboardContent.length > 50 ? '...' : ''),
        [
          { text: t('cancel'), style: 'cancel', onPress: clearClipboardContent },
          { text: t('paste'), onPress: () => {
            addItem(clipboardContent);
            clearClipboardContent();
          }}
        ]
      );
    }
  }, [clipboardContent]);

  if (!roomId) return null;

  const handleDelete = (itemId: string) => {
    Alert.alert(t('delete'), t('confirmDelete'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: () => deleteItem(itemId) },
    ]);
  };

  const handlePasswordSubmit = () => {
    setPassword(passwordInput);
    fetchRoom(passwordInput);
  };

  const renderItem = ({ item }: { item: RoomItem }) => (
    <View style={styles.itemContainer}>
      {item.type === 'text' && item.content && (
        <TextCard content={item.content} onDelete={() => handleDelete(item.id)} />
      )}
      {item.type === 'image' && item.url && (
        <ImageCard url={item.url} onDelete={() => handleDelete(item.id)} />
      )}
      {item.type === 'audio' && item.url && (
        <AudioCard url={item.url} filename={item.filename} onDelete={() => handleDelete(item.id)} />
      )}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Stack.Screen
        options={{
          title: roomId,
          headerRight: () => <ConnectionStatus status={wsStatus} />
        }}
      />

      {loading && items.length === 0 ? (
        <ActivityIndicator style={styles.loader} size="large" color={theme.tint} />
      ) : requiresPassword ? (
        <View style={styles.passwordContainer}>
          <Text style={[styles.passwordTitle, { color: theme.text }]}>
            {t('roomPasswordProtected') ?? 'This room is password protected'}
          </Text>
          <TextInput
            style={[styles.passwordInput, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
            secureTextEntry
            placeholder={t('enterPassword') ?? 'Enter password'}
            placeholderTextColor={theme.tabIconDefault}
            value={passwordInput}
            onChangeText={setPasswordInput}
            onSubmitEditing={handlePasswordSubmit}
            returnKeyType="go"
            autoFocus
          />
          <TouchableOpacity
            style={[styles.passwordButton, { backgroundColor: theme.tint }]}
            onPress={handlePasswordSubmit}
          >
            <Text style={styles.passwordButtonText}>{t('enter') ?? 'Enter'}</Text>
          </TouchableOpacity>
        </View>
      ) : error ? (
        <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>
      ) : (
        <FlatList
          ref={flatListRef}
          data={items}
          keyExtractor={item => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onRefresh={fetchRoom}
          refreshing={loading}
        />
      )}

      {!requiresPassword && <BottomBar roomId={roomId} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center' },
  error: { padding: 16, textAlign: 'center' },
  listContent: { padding: 16, paddingBottom: 32 },
  itemContainer: { marginBottom: 8 },
  passwordContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  passwordTitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  passwordInput: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 48,
    fontSize: 16,
    marginBottom: 16,
  },
  passwordButton: {
    width: '100%',
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passwordButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
