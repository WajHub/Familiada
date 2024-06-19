// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

const API = {
    toStartPage: () =>ipcRenderer.send("toStartPage"),
    addNewQuestion: (question, answers, points) => ipcRenderer.send("addNewQuestion", question, answers, points),
    setFilePath: (path, isNewFile) => ipcRenderer.send("setFilePath", path, isNewFile),

    create_new_set: (title) => ipcRenderer.send("save_new_set", title),
    get_sets: () => ipcRenderer.invoke('get_sets')
}

contextBridge.exposeInMainWorld("api", API);