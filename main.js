import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import path from 'path';
import fs from 'fs';
import { digitizePhotos, verifyFaces } from './backend/gateway/index.js';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'), // updated for ESM
        },
    });

    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    mainWindow.webContents.on('did-finish-load', () => {
        console.log('App URL:', mainWindow.webContents.getURL());
    });
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
                const result = await dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] });
                return result.canceled ? null : result.filePaths[0];

            case 'processPhotos':
                return await digitizePhotos(payload.folderPath);

            case 'verifyFace':
                console.log(payload)
                return await verifyFaces(payload);

            default:
                return { error: 'Unknown action' };
        }
    } catch (err) {
        console.error(err);
        return { error: err.message };
    }
});
