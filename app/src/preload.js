// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const { contextBridge, ipcRenderer } = require("electron");

const API = {
  // Main ---> Renderer (callbacks)
  onDisplayQuestion: (callback) => {
    const subscription = (_event, value) => callback(value);
    ipcRenderer.on("displayQuestion", subscription);
    return () => ipcRenderer.removeListener("displayQuestion", subscription);
  },
  onDisplayQuestionMain: (callback) => {
    const subscription = (_event, content, last, first) =>
      callback(content, last, first);
    ipcRenderer.on("displayQuestionMain", subscription);
    return () =>
      ipcRenderer.removeListener("displayQuestionMain", subscription);
  },
  onDisplayAnswer: (callback) => {
    const subscription = (_event, value, idAnswer, index) =>
      callback(value, idAnswer, index);
    ipcRenderer.on("displayAnswer", subscription);
    return () => ipcRenderer.removeListener("displayAnswer", subscription);
  },
  onDisplayHiddenAnswer: (callback) => {
    const subscription = (_event, index, idAnswer) =>
      callback(index, idAnswer);
    ipcRenderer.on("displayHiddenAnswer", subscription);
    return () =>
      ipcRenderer.removeListener("displayHiddenAnswer", subscription);
  },
  onDisplayPointsForQuestion: (callback) => {
    const subscription = (_event, points) => callback(points);
    ipcRenderer.on("displayPointsForQuestion", subscription);
    return () =>
      ipcRenderer.removeListener("displayPointsForQuestion", subscription);
  },
  onWrongAnswer: (callback) => {
    const subscription = (_event, team) => callback(team);
    ipcRenderer.on("wrongAnswer", subscription);
    return () => ipcRenderer.removeListener("wrongAnswer", subscription);
  },
  onStatsTeam: (callback) => {
    const subscription = (_event, redName, blueName, redPoints, bluePoints) =>
      callback(redName, blueName, redPoints, bluePoints);
    ipcRenderer.on("statsTeam", subscription);
    return () => ipcRenderer.removeListener("statsTeam", subscription);
  },
  onExposeAnswerOnBoard: (callback) => {
    const subscription = (_event, answer, idAnswer, points) =>
      callback(answer, idAnswer, points);
    ipcRenderer.on("exposeAnswerOnBoard", subscription);
    return () =>
      ipcRenderer.removeListener("exposeAnswerOnBoard", subscription);
  },
  onUpdateAnswers: (callback) => {
    const subscription = (_event) => callback();
    ipcRenderer.on("updateAnswers", subscription);
    return () => ipcRenderer.removeListener("updateAnswers", subscription);
  },

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
