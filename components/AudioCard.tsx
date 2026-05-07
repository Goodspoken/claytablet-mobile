import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import { useTranslation } from '../constants/i18n';
import { useThemeColor } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Storage } from '../services/storage';

export function AudioCard({ url, filename, onDelete }: { url: string; filename?: string; onDelete?: () => void }) {
  const { t } = useTranslation();
  const theme = useThemeColor();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fullUrl, setFullUrl] = useState('');

  useEffect(() => {
    Storage.getServerUrl().then(server => setFullUrl(`${server}${url}`));
  }, [url]);

  async function playSound() {
    if (!fullUrl) return;
    
    if (sound) {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
      return;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: fullUrl },
      { shouldPlay: true }
    );
    
    newSound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        setIsPlaying(status.isPlaying);
        if (status.didJustFinish) {
          setIsPlaying(false);
        }
      }
    });

    setSound(newSound);
    setIsPlaying(true);
  }

  useEffect(() => {
    return sound ? () => { sound.unloadAsync(); } : undefined;
  }, [sound]);

  if (!fullUrl) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <TouchableOpacity onPress={playSound} style={styles.playButton}>
        <Ionicons name={isPlaying ? "pause" : "play"} size={24} color={theme.tint} />
      </TouchableOpacity>
      <View style={styles.info}>
        <Text style={[styles.filename, { color: theme.text }]} numberOfLines={1}>
          {filename || 'Audio Message'}
        </Text>
      </View>
      {onDelete && (
        <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  filename: {
    fontSize: 16,
    fontWeight: '500',
  },
  deleteBtn: {
    padding: 8,
  },
});
