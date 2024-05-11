// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, ipcRenderer } = require('electron');

const API = {
    createNewSet: (nameFile) => ipcRenderer.send("createNewSet", nameFile),
    toStartPage: () =>ipcRenderer.send("toStartPage")
}

contextBridge.exposeInMainWorld("api", API);