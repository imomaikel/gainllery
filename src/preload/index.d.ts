import { CustomIPC } from './types';

declare global {
  interface Window {
    ipc: CustomIPC;
  }
}
