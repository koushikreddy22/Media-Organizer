// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectPath: () => ipcRenderer.invoke('backend:action', { action: 'selectFolder' }),
  operateOnPath: (folderPath) =>
    ipcRenderer.invoke('backend:action', { action: 'processPhotos', payload: { folderPath } }),
  verifyFace: (data) =>
    ipcRenderer.invoke('backend:action', { action: 'verifyFace', payload: data }),
});
