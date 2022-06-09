const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    user: {
        send(message) {
            ipcRenderer.send('test', message);
        },
    },
});
