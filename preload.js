const { contextBridge, ipcRenderer, remote, shell } = require('electron');

contextBridge.exposeInMainWorld('$electron', {
    ipcRenderer: {
        ...ipcRenderer,
        on: ipcRenderer.on
    },
});
