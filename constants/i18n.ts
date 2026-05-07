import { useState, useEffect } from 'react';

const translations = {
  en: {
    home: 'Home',
    settings: 'Settings',
    recentRooms: 'Recent Rooms',
    createNewRoom: 'Create New Room',
    goToRoom: 'Go to Room',
    enterRoomId: 'Enter Room ID',
    scanQr: 'Scan QR Code',
    server: 'Server URL',
    theme: 'Theme',
    language: 'Language',
    light: 'Light',
    dark: 'Dark',
    system: 'System',
    logout: 'Logout',
    signInGoogle: 'Sign in with Google',
    signInYandex: 'Sign in with Yandex',
    typeMessage: 'Type a message...',
    copy: 'Copy',
    share: 'Share',
    delete: 'Delete',
    cancel: 'Cancel',
    clipboardDetect: 'Content found in clipboard',
    paste: 'Paste',
    play: 'Play',
    pause: 'Pause',
    offline: 'Offline',
    online: 'Online',
    connecting: 'Connecting...',
    record: 'Hold to record',
    unsupportedFile: 'Unsupported file type',
    noRecentRooms: 'No recent rooms',
    save: 'Save',
    confirmDelete: 'Delete this item?',
    noCameraAccess: 'No camera access',
    requestAccess: 'Request Access',
    signIn: 'Sign In',
    roomPasswordProtected: 'This room is password protected',
    enterPassword: 'Enter password',
    enter: 'Enter',
  },
  ru: {
    home: 'Главная',
    settings: 'Настройки',
    recentRooms: 'Последние комнаты',
    createNewRoom: 'Создать новую',
    goToRoom: 'Перейти',
    enterRoomId: 'Введите ID комнаты',
    scanQr: 'Сканировать QR',
    server: 'URL сервера',
    theme: 'Тема',
    language: 'Язык',
    light: 'Светлая',
    dark: 'Тёмная',
    system: 'Системная',
    logout: 'Выйти',
    signInGoogle: 'Войти через Google',
    signInYandex: 'Войти через Яндекс',
    typeMessage: 'Введите сообщение...',
    copy: 'Копировать',
    share: 'Поделиться',
    delete: 'Удалить',
    cancel: 'Отмена',
    clipboardDetect: 'В буфере найден контент',
    paste: 'Вставить',
    play: 'Воспроизвести',
    pause: 'Пауза',
    offline: 'Оффлайн',
    online: 'Онлайн',
    connecting: 'Соединение...',
    record: 'Удерживайте для записи',
    unsupportedFile: 'Неподдерживаемый файл',
    noRecentRooms: 'Нет последних комнат',
    save: 'Сохранить',
    confirmDelete: 'Удалить эту запись?',
    noCameraAccess: 'Нет доступа к камере',
    requestAccess: 'Разрешить доступ',
    signIn: 'Войти',
    roomPasswordProtected: 'Комната защищена паролем',
    enterPassword: 'Введите пароль',
    enter: 'Войти',
  }
};

let currentLocale: 'en' | 'ru' = 'ru';
const listeners: (() => void)[] = [];

export const i18n = {
  t: (key: keyof typeof translations['en']) => {
    return translations[currentLocale][key] || translations['en'][key] || key;
  },
  setLocale: (locale: 'en' | 'ru') => {
    currentLocale = locale;
    listeners.forEach(l => l());
  },
  getLocale: () => currentLocale,
  subscribe: (listener: () => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) listeners.splice(index, 1);
    };
  }
};

export function useTranslation() {
  const [, setTick] = useState(0);
  useEffect(() => {
    return i18n.subscribe(() => setTick(t => t + 1));
  }, []);
  return { t: i18n.t, locale: i18n.getLocale() };
}
