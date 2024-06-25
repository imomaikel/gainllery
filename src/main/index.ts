import { electronApp, is, optimizer } from '@electron-toolkit/utils';
import { BrowserWindow, app, protocol, shell } from 'electron';
import { registerIPCMainListeners } from './ipc';
import path from 'path';

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 520,
    height: 520,
    minHeight: 640,
    minWidth: 440,
    show: false,
    // ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      sandbox: false,
      webSecurity: true,
    },
  });

  mainWindow.removeMenu();

  mainWindow.on('ready-to-show', () => {
    mainWindow?.show();
    registerIPCMainListeners(mainWindow);
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: 'deny' };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']);
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'), { hash: '/' });
  }
}

app.whenReady().then(async () => {
  // Handle local files
  // https://github.com/electron/electron/issues/38749
  protocol.registerFileProtocol('atom', (req, cb) => {
    const url = req.url.slice('atom://'.length);
    cb({ path: decodeURIComponent(url) });
  });

  // Set app user model id for windows
  electronApp.setAppUserModelId('com.gainllery');

  // Devtools
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });

  createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
