const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const sequelize = require(path.join(__dirname, "../database/sequelize"));
const Service = require("./service");
const gameLogic = require("./gameLogic");

let mainWindow = null;
let boardWindow = null;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

function safeSend(win, channel, ...args) {
  if (
    win &&
    !win.isDestroyed() &&
    win.webContents &&
    !win.webContents.isDestroyed()
  ) {
    win.webContents.send(channel, ...args);
  }
}

const createWindow = () => {
  const isDev = !app.isPackaged;

  boardWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    boardWindow.loadURL("http://localhost:9000/#/BoardPanel");
    mainWindow.loadURL("http://localhost:9000/#/");
  } else {
    const indexPath = path.join(__dirname, "../dist/index.html");
    boardWindow.loadFile(indexPath, { hash: "/BoardPanel" });
    mainWindow.loadFile(indexPath, { hash: "/" });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  boardWindow.on("closed", () => {
    boardWindow = null;
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    sequelize.close();
    app.quit();
  }
});

// IPC handles for Collections
ipcMain.handle("getCollections", Service.getCollections);
ipcMain.handle("saveCollection", async (_event, title) => {
  return await Service.saveCollection(title);
});
ipcMain.handle("deleteCollection", async (_event, id) => {
  return await Service.deleteCollection(id);
});
ipcMain.handle("setCurrentCollection", async (_event, id) => {
  return await gameLogic.setCurrentCollection(id);
});

// IPC handles for Questions
ipcMain.handle("addNewQuestion", async (_event, question, answers, points) => {
  return await gameLogic.addNewQuestion(question, answers, points);
});
ipcMain.handle("getCollectionTitle", gameLogic.getCollectionTitle);
ipcMain.handle("getQuestions", async () => {
  const collectionId = gameLogic.getCollectionId();
  return await Service.getQuestions(collectionId);
});
ipcMain.handle("getAnswers", async (_event, id) => {
  return await Service.getAnswers(id);
});
ipcMain.handle("setGameData", async (_event, team1, team2, questionsId) => {
  await gameLogic.setGameData(team1, team2, questionsId);
  return true;
});
ipcMain.handle("deleteQuestion", async (_event, id) => {
  return await Service.deleteQuestion(id);
});
ipcMain.handle(
  "updateQuestion",
  async (_event, id, questionContent, answersContent, answersPoints) => {
    await Service.updateQuestion(
      id,
      questionContent,
      answersContent,
      answersPoints
    );
    safeSend(mainWindow, "updateAnswers");
    return true;
  }
);
ipcMain.handle("getQuestion", async (_event, id) => {
  return await Service.getQuestion(id);
});
ipcMain.handle("reorderQuestions", async (_event, questionIds) => {
  return await Service.reorderQuestions(questionIds);
});

// IPC handles for GamePanel
ipcMain.on("startGame", startGame);
ipcMain.on("nextQuestion", () => {
  navigateQuestion(1);
});
ipcMain.on("prevQuestion", () => {
  navigateQuestion(-1);
});
ipcMain.on("guessAnswer", async (_event, id) => {
  const answer = await Service.getAnswer(id);
  if (answer) {
    const content = answer.dataValues ? answer.dataValues.content : answer.content;
    const points = answer.dataValues ? answer.dataValues.points : answer.points;
    const answerId = answer.dataValues ? answer.dataValues.id : answer.id;

    safeSend(boardWindow, "exposeAnswerOnBoard", content + " " + points, answerId, points);
    pointsForQuestion += points;
    safeSend(boardWindow, "displayPointsForQuestion", pointsForQuestion);
    safeSend(mainWindow, "displayPointsForQuestion", pointsForQuestion);
  }
});
ipcMain.on("exposeAnswer", async (_event, id) => {
  const answer = await Service.getAnswer(id);
  if (answer) {
    const content = answer.dataValues ? answer.dataValues.content : answer.content;
    const points = answer.dataValues ? answer.dataValues.points : answer.points;
    const answerId = answer.dataValues ? answer.dataValues.id : answer.id;

    safeSend(boardWindow, "exposeAnswerOnBoard", content + " " + points, answerId);
  }
});
ipcMain.on("wrongAnswer", (_event, team) => {
  if (team && team.teamColor === "RED") {
    safeSend(boardWindow, "wrongAnswer", "red");
  } else {
    safeSend(boardWindow, "wrongAnswer", "blue");
  }
});
ipcMain.on("win", (_event, team) => {
  if (team === "RED") {
    gameLogic.addPointsToRed(pointsForQuestion);
  } else {
    gameLogic.addPointsToBlue(pointsForQuestion);
  }
  safeSend(
    mainWindow,
    "statsTeam",
    gameLogic.getTeamRed(),
    gameLogic.getTeamBlue(),
    gameLogic.getRedPoints(),
    gameLogic.getBluePoints()
  );
  safeSend(
    boardWindow,
    "statsTeam",
    gameLogic.getTeamRed(),
    gameLogic.getTeamBlue(),
    gameLogic.getRedPoints(),
    gameLogic.getBluePoints()
  );
});
ipcMain.on("deleteCurrentCollection", () => {
  gameState.status = GAME_STATUS.IDLE;
  gameState.questions = [];
  gameState.index = 0;
  gameState.renderVersion++;
  pointsForQuestion = 0;
  gameLogic.clearData();
});

// GAME STATE
const GAME_STATUS = Object.freeze({
  IDLE: "idle",
  LOADING: "loading",
  ACTIVE: "active",
  COMPLETE: "complete",
});

const gameState = {
  status: GAME_STATUS.IDLE,
  questions: [],
  index: 0,
  renderVersion: 0,
};
let pointsForQuestion = 0;

async function startGame() {
  if (gameState.status !== GAME_STATUS.IDLE) {
    return;
  }

  gameState.status = GAME_STATUS.LOADING;
  const sessionVersion = gameState.renderVersion;

  try {
    const questions = await gameLogic.getQuestions();

    if (sessionVersion !== gameState.renderVersion) {
      return;
    }

    gameState.questions = questions;
    gameState.index = 0;

    if (questions.length === 0) {
      gameState.status = GAME_STATUS.COMPLETE;
      return;
    }

    gameState.status = GAME_STATUS.ACTIVE;
    renderCurrentQuestion();
  } catch (error) {
    gameState.status = GAME_STATUS.IDLE;
    console.error("Unable to start game", error);
  }
}

function navigateQuestion(direction) {
  if (
    gameState.status !== GAME_STATUS.ACTIVE ||
    gameState.questions.length === 0
  ) {
    return;
  }

  const lastIndex = gameState.questions.length - 1;
  const nextIndex = Math.max(
    0,
    Math.min(lastIndex, gameState.index + direction)
  );

  if (nextIndex === gameState.index) {
    return;
  }

  gameState.index = nextIndex;
  renderCurrentQuestion();
}

function renderCurrentQuestion() {
  const question = gameState.questions[gameState.index];
  const renderVersion = ++gameState.renderVersion;

  sendQuestionsPointsTeamsToRender(
    question,
    gameState.questions.length,
    gameState.index
  );
  sendAnswersToRender(question.id, renderVersion);
}

// Send Data to Render
function sendQuestionsPointsTeamsToRender(question, length, index) {
  pointsForQuestion = 0;

  safeSend(boardWindow, "displayQuestion", question.content);
  safeSend(boardWindow, "displayPointsForQuestion", pointsForQuestion);

  safeSend(mainWindow, "displayPointsForQuestion", pointsForQuestion);

  safeSend(
    mainWindow,
    "displayQuestionMain",
    question.content,
    index === 0,
    index === length - 1
  );
  safeSend(
    mainWindow,
    "statsTeam",
    gameLogic.getTeamRed(),
    gameLogic.getTeamBlue(),
    gameLogic.getRedPoints(),
    gameLogic.getBluePoints()
  );
  safeSend(
    boardWindow,
    "statsTeam",
    gameLogic.getTeamRed(),
    gameLogic.getTeamBlue(),
    gameLogic.getRedPoints(),
    gameLogic.getBluePoints()
  );
}

async function sendAnswersToRender(questionId, renderVersion) {
  let index = 0;
  try {
    const answers = await Service.getAnswers(questionId);

    if (renderVersion !== gameState.renderVersion) {
      return;
    }

    const sortedAnswers = answers.sort(sortAnswersByPoints);

    for (const answer of sortedAnswers) {
      index++;
      const content = answer.dataValues ? answer.dataValues.content : answer.content;
      const id = answer.dataValues ? answer.dataValues.id : answer.id;

      safeSend(mainWindow, "displayAnswer", content, id, index);
      safeSend(boardWindow, "displayHiddenAnswer", index, id);
    }
  } catch (error) {
    console.error("Unable to load answers for question", error);
  }
}

function sortAnswersByPoints(a, b) {
  const pointsA = a.dataValues ? a.dataValues.points : a.points;
  const pointsB = b.dataValues ? b.dataValues.points : b.points;
  return pointsB - pointsA;
}
