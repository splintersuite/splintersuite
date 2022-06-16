const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    user: {
        login: (payload) => ipcRenderer.invoke('user:login', payload),
        logout: () => ipcRenderer.invoke('user:logout'),
        get: () => ipcRenderer.invoke('user:get'),
    },
    bot: {
        start: () => ipcRenderer.invoke('bot:start'),
        stop: () => ipcRenderer.invoke('bot:stop'),
        getActive: () => ipcRenderer.invoke('bot:getActive'),
        getSettings: () => ipcRenderer.invoke('bot:getSettings'),
        updateSettings: (payload) =>
            ipcRenderer.invoke('bot:updateSettings', payload),
        getStats: () => ipcRenderer.invoke('bot:getStats'),
        updateLoading: (callback) =>
            ipcRenderer.on('bot:updateLoading', callback),
    },
    invoice: {
        get: () => ipcRenderer.invoke('invoice:get'),
        update: (payload) => ipcRenderer.invoke('invoice:update', payload),
        confirm: (payload) => ipcRenderer.invoke('invoice:confirm', payload),
    },
});
