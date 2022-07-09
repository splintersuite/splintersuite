const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    user: {
        get: () => ipcRenderer.invoke('user:get'),
    },
    market: {
        getMarketPrices: () => ipcRenderer.invoke('market:getMarketPrices'),
    },
    bot: {
        start: (callback) => ipcRenderer.on('bot:start', callback),
        stop: (callback) => ipcRenderer.on('bot:stop', callback),
        getActive: () => ipcRenderer.invoke('bot:getActive'),
        getSettings: () => ipcRenderer.invoke('bot:getSettings'),
        getStats: () => ipcRenderer.invoke('bot:getStats'),
        updateStats: (payload) =>
            ipcRenderer.invoke('bot:updateStats', payload),
        updateLoading: (payload) =>
            ipcRenderer.invoke('bot:updateLoading', payload),
        log: (payload) => ipcRenderer.invoke('bot:log', payload),
    },
    hive: {
        createRentals: (payload) =>
            ipcRenderer.invoke('hive:createRentals', payload),
        updateRentals: (payload) =>
            ipcRenderer.invoke('hive:updateRentals', payload),
        deleteRentals: (payload) =>
            ipcRenderer.invoke('hive:deleteRentals', payload),
    },
});
