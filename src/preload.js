const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    user: {
        login: (payload) => ipcRenderer.invoke('user:login', payload),
        start: (payload) => ipcRenderer.invoke('user:start'),
        stop: (payload) => ipcRenderer.invoke('user:stop'),
    },
});
