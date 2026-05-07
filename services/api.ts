import { Storage } from './storage';

export const API = {
  async fetchWithAuth(url: string, options: RequestInit = {}) {
    const serverUrl = await Storage.getServerUrl();
    const token = await Storage.getToken();
    
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    
    return fetch(`${serverUrl}${url}`, {
      ...options,
      headers
    });
  },

  async getRoom(roomId: string, password?: string) {
    const headers: Record<string, string> = {};
    if (password) headers['X-Room-Password'] = password;
    const res = await this.fetchWithAuth(`/api/claytablet/${roomId}`, { headers });
    if (!res.ok) throw new Error('Failed to load room');
    return res.json();
  },

  async addText(roomId: string, content: string) {
    const res = await this.fetchWithAuth(`/api/claytablet/${roomId}/text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
    if (!res.ok) throw new Error('Failed to add text');
    return res.json();
  },

  async uploadMedia(roomId: string, type: 'image' | 'audio', fileUri: string, mimeType: string, filename: string) {
    const formData = new FormData();
    // React Native FormData accepts uri/type/name — тип не совпадает со стандартным File
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    formData.append('file', { uri: fileUri, type: mimeType, name: filename } as unknown as Blob);

    const res = await this.fetchWithAuth(`/api/claytablet/${roomId}/${type}`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) throw new Error(`Failed to upload ${type}`);
    return res.json();
  },

  async deleteItem(roomId: string, itemId: string) {
    const res = await this.fetchWithAuth(`/api/claytablet/${roomId}/${itemId}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete item');
  },

  async clearRoom(roomId: string) {
    const res = await this.fetchWithAuth(`/api/claytablet/${roomId}/all`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to clear room');
  }
};
