import { CustomIPC, CustomStore } from './types';

declare global {
  interface Window {
    ipc: CustomIPC;
    store: CustomStore;
  }
}
