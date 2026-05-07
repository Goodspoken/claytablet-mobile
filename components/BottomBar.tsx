import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import { useTranslation } from '../constants/i18n';
import { useThemeColor } from '../constants/colors';
import { API } from '../services/api';

export function BottomBar({ roomId }: { roomId: string }) {
  const { t } = useTranslation();
  const theme = useThemeColor();
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);

  const handleSendText = async () => {
    if (!text.trim()) return;
    try {
      await API.addText(roomId, text.trim());
      setText('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleAttachImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const asset = result.assets[0];
      setIsUploading(true);
      try {
        const ext = asset.uri.split('.').pop() || 'jpg';
        const mimeType = asset.mimeType || `image/${ext}`;
        const filename = asset.fileName || `image.${ext}`;
        await API.uploadMedia(roomId, 'image', asset.uri, mimeType, filename);
      } catch (e) {
        console.error(e);
      } finally {
        setIsUploading(false);
      }
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setRecording(null);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        setIsUploading(true);
        await API.uploadMedia(roomId, 'audio', uri, 'audio/m4a', 'audio.m4a');
        setIsUploading(false);
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
      setIsUploading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
      <TouchableOpacity onPress={handleAttachImage} style={styles.iconButton} disabled={isUploading}>
        <Ionicons name="image-outline" size={24} color={theme.tabIconDefault} />
      </TouchableOpacity>
      
      <TextInput
        style={[styles.input, { color: theme.text, backgroundColor: theme.background }]}
        placeholder={t('typeMessage')}
        placeholderTextColor={theme.tabIconDefault}
        value={text}
        onChangeText={setText}
        multiline
        maxLength={5000}
      />
      
      {isUploading ? (
        <View style={styles.iconButton}>
          <ActivityIndicator size="small" color={theme.tint} />
        </View>
      ) : text.trim().length > 0 ? (
        <TouchableOpacity onPress={handleSendText} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity 
          onPressIn={startRecording} 
          onPressOut={stopRecording} 
          style={[styles.iconButton, recording ? styles.recordingActive : null]}
        >
          <Ionicons name="mic-outline" size={24} color={recording ? '#EF4444' : theme.tabIconDefault} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 12,
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 120,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 10,
    marginHorizontal: 8,
    fontSize: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 2,
    paddingLeft: 4,
  },
  recordingActive: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 20,
  }
});
