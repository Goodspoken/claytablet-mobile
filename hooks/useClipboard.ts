import { useState, useEffect, useRef } from 'react';
import * as Clipboard from 'expo-clipboard';
import { AppState, AppStateStatus } from 'react-native';

export function useClipboard() {
  const [clipboardContent, setClipboardContent] = useState<string | null>(null);
  const lastSeenRef = useRef<string | null>(null);

  const checkClipboard = async () => {
    try {
      const hasString = await Clipboard.hasStringAsync();
      if (!hasString) return;
      const content = await Clipboard.getStringAsync();
      // Предлагаем вставить только если контент новый
      if (content && content !== lastSeenRef.current) {
        lastSeenRef.current = content;
        setClipboardContent(content);
      }
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    checkClipboard();
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') checkClipboard();
    });
    return () => sub.remove();
  }, []);

  const clearClipboardContent = () => setClipboardContent(null);

  return { clipboardContent, clearClipboardContent };
}
