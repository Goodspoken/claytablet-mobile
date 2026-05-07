import { useEffect, useRef, useState, useCallback } from 'react';
import { Storage } from '../services/storage';

export function useWebSocket(roomId: string | undefined, onSync: () => void) {
  const [status, setStatus] = useState<'connecting' | 'online' | 'offline'>('connecting');
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const attempts = useRef(0);

  const connect = useCallback(async () => {
    if (!roomId) return;
    
    setStatus('connecting');
    let serverUrl = await Storage.getServerUrl();
    serverUrl = serverUrl.replace(/^http/, 'ws');
    
    const ws = new WebSocket(`${serverUrl}/api/ws/rooms/${roomId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setStatus('online');
      attempts.current = 0;
    };

    ws.onmessage = (event) => {
      if (event.data === 'sync') {
        onSync();
      } else if (event.data === 'ping') {
        ws.send('pong');
      }
    };

    ws.onclose = () => {
      setStatus('offline');
      const delay = Math.min(1000 * Math.pow(2, attempts.current), 30000);
      attempts.current += 1;
      reconnectTimeout.current = setTimeout(connect, delay);
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [roomId, onSync]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimeout.current) clearTimeout(reconnectTimeout.current);
      if (wsRef.current) {
        wsRef.current.onclose = null;
        wsRef.current.close();
      }
    };
  }, [connect]);

  return { status };
}
