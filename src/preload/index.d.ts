import { ElectronAPI } from '@electron-toolkit/preload';

declare global {
  interface Window {
    electron: ElectronAPI;
    store: {
      get: (key: string) => unknown;
      set: (key: string, val: unknown) => void;
    };
    api: unknown;
  }
}
