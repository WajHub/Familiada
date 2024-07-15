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
    setGameData: (team1, team2, questionsId) => ipcRenderer.send("setGameData", team1, team2, questionsId),

    startGame: () => ipcRenderer.send("startGame"),
    onDisplayQuestion: (callback) => ipcRenderer.on('displayQuestion', (_event, value) => callback(value)),
    onDisplayQuestionMain: (callback) => ipcRenderer.on('displayQuestionMain', (_event, content, last, first) => callback(content, last, first)),
    onDisplayAnswer: (callback) => ipcRenderer.on('displayAnswer', (_event, value, idAnswer, index) => callback(value, idAnswer, index)),
    onDisplayHiddenAnswer: (callback) => ipcRenderer.on('displayHiddenAnswer', (_event, index, idAnswer) => callback(index, idAnswer)),
    nextQuestion: () => ipcRenderer.send('nextQuestion'),
    prevQuestion: () => ipcRenderer.send('prevQuestion'),
    exposeAnswer: (id) => ipcRenderer.send('exposeAnswer', id),
    guessAnswer: (id) => ipcRenderer.send('guessAnswer', id),
    onExposeAnswerOnBoard: (callback) => ipcRenderer.on('exposeAnswerOnBoard', (_event, answer, idAnswer, points) => callback(answer, idAnswer, points)),
    onDisplayPointsForQuestion: (callback) => ipcRenderer.on('displayPointsForQuestion', (_event, points) =>callback(points)),
    wrongAnswer: (team) => ipcRenderer.send('wrongAnswer', team),
    onWrongAnswer: (callback) => ipcRenderer.on('wrongAnswer', (_event, team) => callback(team)),
    onStatsTeam: (callback) => ipcRenderer.on('statsTeam', (_event, redName, blueName, redPoints, bluePoints) => callback(redName, blueName, redPoints, bluePoints)),
    win: (team) => ipcRenderer.send('win', team),
    deleteCurrentCollection: () => ipcRenderer.send('deleteCurrentCollection')
 }

contextBridge.exposeInMainWorld("api", API);