const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("node:path");
const sequelize = require(path.join(__dirname, "../database/sequelize"));
const Service = require("./service");
const gameLogic = require("./gameLogic");

var mainWindow;
var boardWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
  app.quit();
}

const createWindow = () => {
  boardWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  boardWindow.loadURL("http://localhost:9000/BoardPanel");

  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL("http://localhost:9000");

  // Open the DevTools.
  // boardWindow.webContents.openDevTools();
  // mainWindow.webContents.openDevTools();

  module.exports = { boardWindow };
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    sequelize.close();
    app.quit();
  }
});

// IPC handles for index
ipcMain.handle("getCollections", Service.getCollections);
ipcMain.on("saveCollection", Service.saveCollection);
ipcMain.handle("deleteCollection", Service.deleteCollection);
ipcMain.on("setCurrentCollection", gameLogic.setCurrentCollection);

// IPC handles for Questions
ipcMain.on("addNewQuestion", gameLogic.addNewQuestion);
ipcMain.handle("getCollectionTitle", gameLogic.getCollectionTitle);
ipcMain.handle("get_questions", async (event) => {
  const collectionId = gameLogic.getCollectionId();
  return await Service.getQuestions(collectionId);
});
ipcMain.handle("get_answers", Service.getAnswers);
ipcMain.handle("setGameData", async (event, team1, team2, questionsId) => {
  console.log("EVENt", event);
  console.log("team1", team1);
  console.log("team2", team2);
  console.log("questionsId", questionsId);
  await gameLogic.setGameData(team1, team2, questionsId);
  return true;
});
ipcMain.on("startGame", startGame);
ipcMain.on(
  "updateQuestion",
  (_event, id, questionContent, answersContent, answersPoints) => {
    Service.updateQuestion(
      _event,
      id,
      questionContent,
      answersContent,
      answersPoints
    );
    mainWindow.webContents.send("updateAnswers");
  }
);

// IPC handles for GamePanel
ipcMain.on("nextQuestion", (event) => {
  navigateQuestion(1);
});
ipcMain.on("prevQuestion", (event) => {
  navigateQuestion(-1);
});
ipcMain.on("guessAnswer", (event, id) => {
  Service.getAnswer(id).then((answer) => {
    boardWindow.webContents.send(
      "exposeAnswerOnBoard",
      answer.content + " " + answer.points,
      answer.id,
      answer.points
    );
    pointsForQuestion += answer.points;
    boardWindow.webContents.send("displayPointsForQuestion", pointsForQuestion);
    mainWindow.send("displayPointsForQuestion", pointsForQuestion);
  });
});
ipcMain.on("exposeAnswer", (event, id) => {
  Service.getAnswer(id).then((answer) => {
    boardWindow.webContents.send(
      "exposeAnswerOnBoard",
      answer.content + " " + answer.points,
      answer.id
    );
  });
});
ipcMain.on("wrongAnswer", (event, team) => {
  if (team.teamColor == "RED") {
    boardWindow.webContents.send("wrongAnswer", "red");
  } else {
    boardWindow.webContents.send("wrongAnswer", "blue");
  }
});
ipcMain.on("win", (event, team) => {
  if (team == "RED") {
    gameLogic.addPointsToRed(pointsForQuestion);
  } else {
    gameLogic.addPointsToBlue(pointsForQuestion);
  }
  mainWindow.webContents.send(
    "statsTeam",
    gameLogic.getTeamRed(),
    gameLogic.getTeamBlue(),
    gameLogic.getRedPoints(),
    gameLogic.getBluePoints()
  );
  boardWindow.webContents.send(
    "statsTeam",
    gameLogic.getTeamRed(),
    gameLogic.getTeamBlue(),
    gameLogic.getRedPoints(),
    gameLogic.getBluePoints()
  );
});
ipcMain.on("deleteQuestion", (_event, id) => {
  Service.deleteQuestion(id);
});
ipcMain.on("deleteCurrentCollection", () => {
  gameState.status = GAME_STATUS.IDLE;
  gameState.questions = [];
  gameState.index = 0;
  gameState.renderVersion++;
  pointsForQuestion = 0;
  gameLogic.clearData();
});
ipcMain.handle("getQuestion", (event, id) => {
  return Service.getQuestion(id);
});

// GAME
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
var pointsForQuestion = 0;

async function startGame(event) {
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

  boardWindow.webContents.send("displayQuestion", question.content);
  boardWindow.webContents.send("displayPointsForQuestion", pointsForQuestion);

  mainWindow.send("displayPointsForQuestion", pointsForQuestion);
  console.log("index", index);
  console.log("length", length);

  mainWindow.webContents.send(
    "displayQuestionMain",
    question.content,
    index == 0,
    index == length - 1
  );
  mainWindow.webContents.send(
    "statsTeam",
    gameLogic.getTeamRed(),
    gameLogic.getTeamBlue(),
    gameLogic.getRedPoints(),
    gameLogic.getBluePoints()
  );
  boardWindow.webContents.send(
    "statsTeam",
    gameLogic.getTeamRed(),
    gameLogic.getTeamBlue(),
    gameLogic.getRedPoints(),
    gameLogic.getBluePoints()
  );
}

async function sendAnswersToRender(questionId, renderVersion) {
  var index = 0;
  try {
    const answers = await Service.getAnswers(null, questionId);

    if (renderVersion !== gameState.renderVersion) {
      return;
    }

    const sortedAnswers = answers.sort(sortAnswersByPoints);

    for (const answer of sortedAnswers) {
      index++;
      mainWindow.webContents.send(
        "displayAnswer",
        answer.content,
        answer.id,
        index
      );
      boardWindow.webContents.send("displayHiddenAnswer", index, answer.id);
    }
  } catch (error) {
    console.error("Unable to load answers for question", error);
  }
}

function sortAnswersByPoints(a, b) {
  if (a.dataValues.points > b.dataValues.points) {
    return -1;
  } else if (a.dataValues.points < b.dataValues.points) {
    return 1;
  } else {
    return 0;
  }
}
