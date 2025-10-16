import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { digitizePhotos, verifyFaces } from './backend/gateway/index.js';
import { uploadPhotos } from './backend/gateway/upload.js';
import { fileURLToPath } from 'url';
import scanEmitter from './eventBus.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

let mainWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'), 
            spellcheck: false,           
            enableWebSQL: false,
            safeDialogs: true,
            devTools: true,
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    mainWindow.webContents.openDevTools();
});


ipcMain.handle('dialog:open', async () => {
    const result = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory']
    })
    if (result.canceled) return null
    return result.filePaths[0]

})

ipcMain.handle('backend:action', async (event, { action, payload }) => {
  try {
    switch (action) {
      case 'selectFolder':
        const result = await dialog.showOpenDialog(mainWindow, {
          properties: ['openDirectory'],
        });
        return result.canceled ? null : result.filePaths[0];

      case 'processPhotos':
        // Pass the event to the function
        return await digitizePhotos(payload.folderPath, event);

      case 'uploadPhotos':
        return await uploadPhotos(payload.folderPath);

      case 'verifyFace':
        return await verifyFaces(payload);

      default:
        return { error: 'Unknown action' };
    }
  } catch (err) {
    console.error(err);
    return { error: err.message };
  }
});

scanEmitter.on('scan-progress', (progress) => {
  if (mainWindow) {
    mainWindow.webContents.send('scan-progress', progress);
  }
});