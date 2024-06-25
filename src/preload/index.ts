import { contextBridge, ipcRenderer } from 'electron';
import { CustomIPC, CustomStore } from './types';

const ipc: CustomIPC = {
  on(channel, cb) {
    ipcRenderer.on(channel, cb);
  },
  send(channel, ...args) {
    ipcRenderer.send(channel, ...args);
  },
  sendSync(channel, ...args) {
    return ipcRenderer.sendSync(channel, ...args);
  },
  removeListener(channel) {
    ipcRenderer.removeAllListeners(channel);
  },
};

const store: CustomStore = {
  get(key, overwriteIfEmpty) {
    return ipcRenderer.sendSync('storeGet', key, overwriteIfEmpty);
  },
  set(key, value) {
    ipcRenderer.send('storeSet', key, value);
  },
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('ipc', ipc);
    contextBridge.exposeInMainWorld('store', store);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-expect-error (define in dts)
  window.ipc = ipc;
  // @ts-expect-error (define in dts)
  window.store = store;
}
