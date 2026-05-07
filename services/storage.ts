import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const Storage = {
  async getServerUrl() {
    return (await SecureStore.getItemAsync('claytablet_server')) || 'https://claytablet.online';
  },
  async setServerUrl(url: string) {
    await SecureStore.setItemAsync('claytablet_server', url);
  },
  async getToken() {
    return await SecureStore.getItemAsync('claytablet_token');
  },
  async setToken(token: string) {
    await SecureStore.setItemAsync('claytablet_token', token);
  },
  async getLocale() {
    return (await AsyncStorage.getItem('claytablet_locale')) as 'en' | 'ru' | null;
  },
  async setLocale(locale: 'en' | 'ru') {
    await AsyncStorage.setItem('claytablet_locale', locale);
  },
  async getRecentRooms(): Promise<string[]> {
    try {
      const v = await AsyncStorage.getItem('recent_rooms');
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  },
  async addRecentRoom(roomId: string) {
    let rooms = await this.getRecentRooms();
    rooms = [roomId, ...rooms.filter(id => id !== roomId)].slice(0, 8);
    await AsyncStorage.setItem('recent_rooms', JSON.stringify(rooms));
  },
  async getRoomCache(roomId: string) {
    try {
      const v = await AsyncStorage.getItem(`room_cache_${roomId}`);
      return v ? JSON.parse(v) : [];
    } catch {
      return [];
    }
  },
  async setRoomCache(roomId: string, data: object[]) {
    await AsyncStorage.setItem(`room_cache_${roomId}`, JSON.stringify(data));
  }
};
