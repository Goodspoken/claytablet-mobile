import { useState, useCallback, useEffect } from 'react';
import { API } from '../services/api';
import { Storage } from '../services/storage';
import { useWebSocket } from './useWebSocket';

export interface RoomItem {
  id: string;
  type: 'text' | 'image' | 'audio' | 'file';
  content?: string;
  url?: string;
  filename?: string;
  created_at: string;
}

export function useRoom(roomId: string) {
  const [items, setItems] = useState<RoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);

  const requiresPassword = error === 'REQUIRES_PASSWORD';

  const fetchRoom = useCallback(async (pw?: string) => {
    try {
      const usedPassword = pw !== undefined ? pw : password;
      const data = await API.getRoom(roomId, usedPassword ?? undefined);
      const all: RoomItem[] = [
        ...(data.texts  || []),
        ...(data.images || []),
        ...(data.audios || []),
        ...(data.files  || []),
      ].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      setItems(all);
      Storage.setRoomCache(roomId, all);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [roomId, password]);

  const { status: wsStatus } = useWebSocket(roomId, fetchRoom);

  useEffect(() => {
    Storage.getRoomCache(roomId).then(cached => {
      if (cached && cached.length > 0 && items.length === 0) {
        setItems(cached);
      }
    });
    fetchRoom();
  }, [roomId, fetchRoom]);

  const addItem = async (content: string) => {
    await API.addText(roomId, content);
  };

  const deleteItem = async (itemId: string) => {
    await API.deleteItem(roomId, itemId);
  };

  return { items, loading, error, wsStatus, fetchRoom, addItem, deleteItem, password, setPassword, requiresPassword };
}
