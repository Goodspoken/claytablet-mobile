import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '../constants/colors';
import { Storage } from '../services/storage';

export function ImageCard({ url, onDelete }: { url: string; onDelete?: () => void }) {
  const theme = useThemeColor();
  const [fullUrl, setFullUrl] = useState('');

  useEffect(() => {
    Storage.getServerUrl().then(server => {
      setFullUrl(`${server}${url}`);
    });
  }, [url]);

  if (!fullUrl) return null;

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <Image
        source={{ uri: fullUrl }}
        style={styles.image}
        contentFit="cover"
        transition={200}
      />
      {onDelete && (
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Ionicons name="trash-outline" size={16} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 8,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: Dimensions.get('window').width * 0.6,
  },
  deleteBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 16,
    padding: 6,
  },
});
