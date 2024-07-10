import { IPCCallArguments, IPCCallCallbackReturn, IPCCallKey, IPCReceiveArguments, IPCReceiverKey } from './types';
import { FILE_TYPES, getAllFilesInDirectory, getAllFilesRecursively, moveFile } from '../files';
import { StoreSchema, StoreSchemaKey } from '../store/types';
import { BrowserWindow, dialog, ipcMain } from 'electron';
import { storageGet, storageSet } from '../store';
import path from 'path';

// Listen to an event from the renderer
const handleChannel = <T extends IPCCallKey>(
  channel: T,
  cb: (event: Electron.IpcMainEvent, ...args: IPCCallArguments<T>) => PromiseLike<IPCCallCallbackReturn<T>>,
) => {
  ipcMain.on(channel, (event, ...args: IPCCallArguments<T>): PromiseLike<IPCCallCallbackReturn<T>> => {
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

    broadcastEvent('filesFetched', {
      paths: filesInDirectories,
      navigateTo: filesInDirectories.length >= 1 ? '/view' : undefined,
    });
  });

  // Open file picker dialog and fetch files
  handleChannel('openFile', async () => {
    const pick = await dialog.showOpenDialog({
      filters: [
        {
          name: 'Media',
          extensions: FILE_TYPES,
        },
      ],
      title: 'Select one or more files',
      properties: ['multiSelections', 'openFile'],
    });
    if (pick.canceled) {
      broadcastEvent('infoToast', 'Pick canceled!');
      return;
    }

    const directories: string[] = [];
    const files: string[] = [];

    for (const filePath of pick.filePaths) {
      const isFile = FILE_TYPES.includes(filePath.substring(filePath.lastIndexOf('.') + 1));
      if (!isFile) {
        directories.push(filePath);
      } else {
        files.push(filePath);
      }
    }

    const filesInDirectories = (
      await Promise.all(directories.map((filePath) => getAllFilesRecursively(filePath)))
    ).flat();

    const allFiles = files.concat(filesInDirectories);
    storageSet('recentPaths', allFiles);

    broadcastEvent('filesFetched', { paths: allFiles, navigateTo: allFiles.length >= 1 ? '/view' : undefined });
  });

  // Open directory picker dialog and select directory to browse
  handleChannel('selectDirectoryPath', async () => {
    const pick = await dialog.showOpenDialog({
      title: 'Select a directory',
      properties: ['openDirectory'],
    });
    if (pick.canceled && !pick.filePaths[0]) {
      broadcastEvent('infoToast', 'Pick canceled!');
      return;
    }

    const directoryPath = pick.filePaths[0];

    broadcastEvent('redirect', `/browse?directoryPath=${directoryPath}`);
  });

  // Get all files in a directory
  handleChannel('getAllFilesInDirectory', async (event, { path: dirPath }) => {
    const files = await getAllFilesInDirectory(dirPath);

    return (event.returnValue = { files });
  });

  // Select directory and get its path
  handleChannel('getDirectoryPath', async (event) => {
    const pick = await dialog.showOpenDialog({
      title: 'Select one or more directories',
      properties: ['openDirectory', 'multiSelections'],
    });
    if (pick.canceled || !pick.filePaths[0]) {
      return (event.returnValue = null);
    }

    const currentDirectories = storageGet('favoriteDirectories', []);
    const currentDirectoriesKeys = currentDirectories.map(({ path: dirPath }) => dirPath);

    const newDirs = pick.filePaths
      .filter((dirPath) => !currentDirectoriesKeys.includes(dirPath))
      .map((dirPath) => ({
        label: path.basename(dirPath),
        path: dirPath,
      }));
    if (!newDirs.length) return (event.returnValue = null);

    storageSet('favoriteDirectories', currentDirectories.concat(newDirs));

    return (event.returnValue = newDirs);
  });

  // Move a file to a different directory
  handleChannel('moveToDirectory', async (event, { dirPath, filePath, asFavorite }) => {
    const newPath = await moveFile(dirPath, filePath);
    if (!newPath) return (event.returnValue = false);

    if (asFavorite) {
      storageSet('favoriteFiles', storageGet('favoriteFiles', []).concat(newPath));
    }

    return (event.returnValue = true);
  });
};
