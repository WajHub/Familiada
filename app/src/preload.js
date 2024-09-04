// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

const API = {
  // Main ---> Renderer (callbacks)
  onDisplayQuestion: (callback) =>
    ipcRenderer.on("displayQuestion", (_event, value) => callback(value)),
  onDisplayQuestionMain: (callback) =>
    ipcRenderer.on("displayQuestionMain", (_event, content, last, first) =>
      callback(content, last, first)
    ),
  onDisplayAnswer: (callback) =>
    ipcRenderer.on("displayAnswer", (_event, value, idAnswer, index) =>
      callback(value, idAnswer, index)
    ),
  onDisplayHiddenAnswer: (callback) =>
    ipcRenderer.on("displayHiddenAnswer", (_event, index, idAnswer) =>
      callback(index, idAnswer)
    ),
  onDisplayPointsForQuestion: (callback) =>
    ipcRenderer.on("displayPointsForQuestion", (_event, points) =>
      callback(points)
    ),
  onWrongAnswer: (callback) =>
    ipcRenderer.on("wrongAnswer", (_event, team) => callback(team)),
  onStatsTeam: (callback) =>
    ipcRenderer.on(
      "statsTeam",
      (_event, redName, blueName, redPoints, bluePoints) =>
        callback(redName, blueName, redPoints, bluePoints)
    ),
  onExposeAnswerOnBoard: (callback) =>
    ipcRenderer.on("exposeAnswerOnBoard", (_event, answer, idAnswer, points) =>
      callback(answer, idAnswer, points)
    ),
  onUpdateAnswers: (callback) =>
    ipcRenderer.on("updateAnswers", (_event) => callback()),

  // Renderer <---> Main (invokes)
  getCollections: () => ipcRenderer.invoke("getCollections"),
  get_questions: () => ipcRenderer.invoke("get_questions"),
  getQuestions: (_event, id) => ipcRenderer.invoke("getQuestion", _event, id),
  get_answers: (id) => ipcRenderer.invoke("get_answers", id),
  get_title: () => ipcRenderer.invoke("getCollectionTitle"),
  deleteCollection: (id) => ipcRenderer.invoke("deleteCollection", id),
  setGameData: (team1, team2, questionsId) =>
    ipcRenderer.invoke("setGameData", team1, team2, questionsId),

  // Renderer ---> Main (sends)
  startGame: () => ipcRenderer.send("startGame"),
  saveCollection: (title) => ipcRenderer.send("saveCollection", title),
  updateQuestion: (id, questionContent, answersContent, answersPoints) =>
    ipcRenderer.send(
      "updateQuestion",
      id,
      questionContent,
      answersContent,
      answersPoints
    ),
  addNewQuestion: (question, answers, points) =>
    ipcRenderer.send("addNewQuestion", question, answers, points),
  setCurrentCollection: (id) => ipcRenderer.send("setCurrentCollection", id),
  nextQuestion: () => ipcRenderer.send("nextQuestion"),
  prevQuestion: () => ipcRenderer.send("prevQuestion"),
  exposeAnswer: (id) => ipcRenderer.send("exposeAnswer", id),
  guessAnswer: (id) => ipcRenderer.send("guessAnswer", id),
  wrongAnswer: (team) => ipcRenderer.send("wrongAnswer", team),
  win: (team) => ipcRenderer.send("win", team),
  deleteCurrentCollection: () => ipcRenderer.send("deleteCurrentCollection"),
  deleteQuestion: (_event, id) =>
    ipcRenderer.send("deleteQuestion", _event, id),
};

contextBridge.exposeInMainWorld("api", API);
