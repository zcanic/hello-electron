import { app, BrowserWindow, nativeTheme } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createMainWindow = () => {
  const window = new BrowserWindow({
    width: 960,
    height: 640,
    backgroundColor: nativeTheme.shouldUseDarkColors ? '#1f1f2e' : '#f2f2f8',
    minWidth: 640,
    minHeight: 480,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      sandbox: true
    }
  });

  window.loadFile(path.join(__dirname, 'index.html'));
};

app.whenReady().then(() => {
  createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
