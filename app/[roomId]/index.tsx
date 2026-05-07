import React, { useEffect, useRef } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Text, Alert } from 'react-native';
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
  const { items, loading, error, wsStatus, fetchRoom, addItem, deleteItem } = useRoom(roomId || '');
  const { clipboardContent, clearClipboardContent } = useClipboard();
  const flatListRef = useRef<FlatList>(null);

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

      <BottomBar roomId={roomId} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center' },
  error: { padding: 16, textAlign: 'center' },
  listContent: { padding: 16, paddingBottom: 32 },
  itemContainer: { marginBottom: 8 }
});
