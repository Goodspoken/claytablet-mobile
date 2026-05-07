import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useTranslation } from '../../constants/i18n';
import { useThemeColor } from '../../constants/colors';
import { Storage } from '../../services/storage';
import { Ionicons } from '@expo/vector-icons';
import * as Crypto from 'expo-crypto';

export default function HomeScreen() {
  const { t } = useTranslation();
  const theme = useThemeColor();
  const router = useRouter();
  const [roomId, setRoomId] = useState('');
  const [recentRooms, setRecentRooms] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();

  useEffect(() => {
    Storage.getRecentRooms().then(setRecentRooms);
  }, []);

  const handleGoToRoom = (id: string) => {
    if (!id) return;
    Storage.addRecentRoom(id);
    router.push(`/${id}`);
  };

  const handleCreateRoom = () => {
    const id = Crypto.randomUUID().slice(0, 8);
    handleGoToRoom(id);
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    setIsScanning(false);
    let finalId = data;
    try {
      const url = new URL(data);
      const parts = url.pathname.split('/');
      finalId = parts[parts.length - 1];
    } catch (e) {
      // not a URL
    }
    if (finalId) handleGoToRoom(finalId);
  };

  if (isScanning) {
    if (!permission?.granted) {
      return (
        <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ color: theme.text, marginBottom: 16 }}>{t('noCameraAccess')}</Text>
          <TouchableOpacity onPress={requestPermission} style={[styles.button, { backgroundColor: theme.tint }]}>
            <Text style={styles.buttonText}>{t('requestAccess')}</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <CameraView
          style={StyleSheet.absoluteFillObject}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarcodeScanned}
        />
        <TouchableOpacity style={styles.cancelScanButton} onPress={() => setIsScanning(false)}>
          <Text style={styles.cancelScanText}>{t('cancel')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.inputGroup}>
        <TextInput
          style={[styles.input, { color: theme.text, borderColor: theme.border, backgroundColor: theme.card }]}
          placeholder={t('enterRoomId')}
          placeholderTextColor={theme.tabIconDefault}
          value={roomId}
          onChangeText={setRoomId}
          autoCapitalize="none"
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.tint }]} onPress={() => handleGoToRoom(roomId)}>
          <Text style={styles.buttonText}>{t('goToRoom')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.actionBtn, { borderColor: theme.border }]} onPress={handleCreateRoom}>
          <Ionicons name="add-circle-outline" size={24} color={theme.tint} />
          <Text style={[styles.actionBtnText, { color: theme.text }]}>{t('createNewRoom')}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionBtn, { borderColor: theme.border }]} onPress={() => setIsScanning(true)}>
          <Ionicons name="qr-code-outline" size={24} color={theme.tint} />
          <Text style={[styles.actionBtnText, { color: theme.text }]}>{t('scanQr')}</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('recentRooms')}</Text>
      {recentRooms.length === 0 ? (
        <Text style={[styles.emptyText, { color: theme.tabIconDefault }]}>{t('noRecentRooms')}</Text>
      ) : (
        <FlatList
          data={recentRooms}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[styles.recentItem, { borderBottomColor: theme.border }]}
              onPress={() => handleGoToRoom(item)}
            >
              <Text style={[styles.recentItemText, { color: theme.text }]}>{item}</Text>
              <Ionicons name="chevron-forward" size={20} color={theme.tabIconDefault} />
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  inputGroup: { flexDirection: 'row', marginBottom: 16 },
  input: { flex: 1, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, height: 48, fontSize: 16, marginRight: 8 },
  button: { justifyContent: 'center', paddingHorizontal: 16, borderRadius: 8, height: 48 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderRadius: 8, padding: 12, marginHorizontal: 4 },
  actionBtnText: { marginLeft: 8, fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12 },
  emptyText: { fontStyle: 'italic', textAlign: 'center', marginTop: 20 },
  recentItem: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16, borderBottomWidth: 1 },
  recentItemText: { fontSize: 16 },
  cancelScanButton: { position: 'absolute', bottom: 40, alignSelf: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 8 },
  cancelScanText: { color: '#000', fontSize: 16, fontWeight: 'bold' }
});
