// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require('electron');

const API = {
    create_new_set: (title) => ipcRenderer.send("save_new_set", title),
    get_sets: () => ipcRenderer.invoke('get_sets'),
    delete_set: (id) => ipcRenderer.invoke("delete_set", id),
    chose_set: (id) => ipcRenderer.send("set_chosen_set", id),
    get_title: () => ipcRenderer.invoke("get_setOfQuestions_title"),
    addNewQuestion: (question, answers, points) => ipcRenderer.send("addNewQuestion", question, answers, points),
    toStartPage: () => ipcRenderer.send("toStartPage"),
    get_questions: () => ipcRenderer.invoke("get_questions"),
    get_answers: (id) => ipcRenderer.invoke("get_answers", id)
 }

contextBridge.exposeInMainWorld("api", API);