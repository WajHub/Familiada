// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

const API = {
    getCollections: () => ipcRenderer.invoke('getCollections'),
    saveCollection: (title) => ipcRenderer.send("saveCollection", title),
    deleteCollection: (id) => ipcRenderer.invoke("deleteCollection", id),
    setCurrentCollection: (id) => ipcRenderer.send("setCurrentCollection", id),
    get_title: () => ipcRenderer.invoke("getCollectionTitle"),

    addNewQuestion: (question, answers, points) => ipcRenderer.send("addNewQuestion", question, answers, points),
    get_questions: () => ipcRenderer.invoke("get_questions"),
    get_answers: (id) => ipcRenderer.invoke("get_answers", id),
    setTeams: (team1, team2) => ipcRenderer.send("setTeams", team1, team2)
 }

contextBridge.exposeInMainWorld("api", API);