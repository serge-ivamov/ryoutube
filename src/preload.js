// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  navigate: (url) => ipcRenderer.send('navigate', url),
  back: () => ipcRenderer.send('back'),
  forward: () => ipcRenderer.send('forward'),
  reload: () => ipcRenderer.send('reload'),
  stop: () => ipcRenderer.send('stop'),
  goYoutube: () => ipcRenderer.send('go-youtube'),
  handleUrlUpdate: (callback) => ipcRenderer.on('update-url', (event, url) => callback(url))
});

