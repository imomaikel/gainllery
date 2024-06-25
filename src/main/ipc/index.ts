import { IPCCallArguments, IPCCallCallbackReturn, IPCCallKey, IPCReceiveArguments, IPCReceiverKey } from './types';
import { StoreSchema, StoreSchemaKey } from '../store/types';
import { BrowserWindow, dialog, ipcMain } from 'electron';
import { storageGet, storageSet } from '../store';
import { getAllFilesRecursively } from '../files';

// Listen to an event from the renderer
const handleChannel = <T extends IPCCallKey>(
  channel: T,
  cb: (event: Electron.IpcMainEvent, ...args: IPCCallArguments<T>) => IPCCallCallbackReturn<T>,
) => {
  ipcMain.on(channel, (event, ...args: IPCCallArguments<T>): IPCCallCallbackReturn<T> => {
    return cb(event, ...args);
  });
};

// Handle storage
const handleStorage = <T extends 'storeSet' | 'storeGet', K extends StoreSchemaKey>(
  method: T,
  cb: (event: Electron.IpcMainEvent, key: K, value: StoreSchema[K]) => T extends 'storeSet' ? void : StoreSchema[K],
) => {
  ipcMain.on(method, (event: Electron.IpcMainEvent, ...args) => {
    return cb(event, args[0], args[1]);
  });
};

export const registerIPCMainListeners = (window: BrowserWindow) => {
  // Handle storage
  handleStorage('storeSet', (_, key, value) => {
    storageSet(key, value);
  });
  handleStorage('storeGet', (event, key, overwriteIfEmpty) => {
    return (event.returnValue = storageGet(key, overwriteIfEmpty));
  });

  // Broadcast message function
  const broadcastEvent = <T extends IPCReceiverKey>(channel: T, ...args: IPCReceiveArguments<T>) => {
    window.webContents.send(channel, ...args);
  };

  // Open directory picker dialog and fetch files
  handleChannel('openDirectory', async () => {
    const pick = await dialog.showOpenDialog({
      title: 'Select one or more directories',
      properties: ['openDirectory', 'multiSelections'],
    });
    if (pick.canceled) {
      broadcastEvent('infoToast', 'Pick canceled!');
      return;
    }

    broadcastEvent('startFilesFetch');
    const filesInDirectories = (
      await Promise.all(pick.filePaths.map((filePath) => getAllFilesRecursively(filePath)))
    ).flat();
    storageSet('recentPaths', filesInDirectories);

    broadcastEvent('filesFetched', { paths: filesInDirectories, navigateTo: '/view' });
  });
};
