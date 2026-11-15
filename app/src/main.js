const { app, BrowserWindow, ipcMain, dialog, screen } = require("electron");
const path = require("node:path");
const sequelize = require(path.join(__dirname, "../database/sequelize"));
const Service = require("./service");
const gameLogic = require("./gameLogic");
const {
  GameSession,
  GuessAnswerCommand,
  ExposeAnswerCommand,
  StrikeCommand,
  AwardRoundCommand,
} = require("./gameSession");

let mainWindow = null;
let boardWindow = null;
let isQuitting = false;
let currentSession = null;

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

function isGameActive() {
  return (
    gameState.status === GAME_STATUS.ACTIVE ||
    gameState.status === GAME_STATUS.LOADING
  );
}

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

function notifyBoardWindowState() {
  const isOpen = Boolean(boardWindow && !boardWindow.isDestroyed());
  safeSend(mainWindow, "boardWindowState", isOpen);
}

async function syncBoardGameState() {
  if (!boardWindow || boardWindow.isDestroyed()) {
    return;
  }

  if (currentSession && gameState.status === GAME_STATUS.ACTIVE) {
    renderCurrentRound();
  } else {
    safeSend(boardWindow, "displayQuestion", "");
    safeSend(boardWindow, "displayPointsForQuestion", 0);
    safeSend(boardWindow, "displayLostChances", 0, 0);
    safeSend(boardWindow, "syncBoardAnswers", []);
    safeSend(boardWindow, "statsTeam", "RED", "BLUE", 0, 0);
  }
}

function getTargetBoardDisplay() {
  const displays = screen.getAllDisplays();
  const primaryDisplay = screen.getPrimaryDisplay();
  let mainDisplay = primaryDisplay;

  if (mainWindow && !mainWindow.isDestroyed()) {
    mainDisplay = screen.getDisplayMatching(mainWindow.getBounds());
  }

  const secondaryDisplay =
    displays.find((d) => d.id !== mainDisplay.id) ||
    displays.find((d) => d.id !== primaryDisplay.id);

  return {
    display: secondaryDisplay || primaryDisplay,
    isExternal: Boolean(secondaryDisplay),
  };
}

function createBoardWindow() {
  const { display: targetDisplay, isExternal } = getTargetBoardDisplay();

  if (boardWindow && !boardWindow.isDestroyed()) {
    const currentDisplay = screen.getDisplayMatching(boardWindow.getBounds());
    if (isExternal && currentDisplay.id !== targetDisplay.id) {
      boardWindow.setFullScreen(false);
      boardWindow.setBounds(targetDisplay.bounds);
      boardWindow.setFullScreen(true);
    }
    if (boardWindow.isMinimized()) {
      boardWindow.restore();
    }
    boardWindow.focus();
    notifyBoardWindowState();
    return boardWindow;
  }

  const isDev = !app.isPackaged;
  const { x, y, width, height } = targetDisplay.bounds;

  boardWindow = new BrowserWindow({
    x,
    y,
    width,
    height,
    fullscreen: true,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  boardWindow.setBounds({ x, y, width, height });
  boardWindow.setFullScreen(true);

  boardWindow.webContents.on("before-input-event", (event, input) => {
    if (input.type === "keyDown") {
      if (input.key === "F11") {
        boardWindow.setFullScreen(!boardWindow.isFullScreen());
        event.preventDefault();
      } else if (input.key === "Escape" && boardWindow.isFullScreen()) {
        boardWindow.setFullScreen(false);
        event.preventDefault();
      }
    }
  });

  if (isDev) {
    boardWindow.loadURL("http://localhost:9000/#/BoardPanel");
  } else {
    const indexPath = path.join(__dirname, "../dist/index.html");
    boardWindow.loadFile(indexPath, { hash: "/BoardPanel" });
  }

  boardWindow.on("close", (event) => {
    if (isQuitting) {
      return;
    }

    if (isGameActive()) {
      event.preventDefault();
      const choice = dialog.showMessageBoxSync(boardWindow, {
        type: "warning",
        buttons: ["Cancel", "Close scoreboard"],
        defaultId: 0,
        cancelId: 0,
        title: "Close Scoreboard",
        message: "A game is currently in progress.",
        detail:
          "Closing the scoreboard window will disconnect the display for the audience. Are you sure you want to close it?",
      });

      if (choice === 1) {
        boardWindow.destroy();
      }
    }
  });

  boardWindow.on("closed", () => {
    boardWindow = null;
    notifyBoardWindowState();
  });

  boardWindow.webContents.on("did-finish-load", () => {
    notifyBoardWindowState();
    syncBoardGameState();
  });

  notifyBoardWindowState();
  return boardWindow;
}

const createWindow = () => {
  const isDev = !app.isPackaged;

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:9000/#/");
  } else {
    const indexPath = path.join(__dirname, "../dist/index.html");
    mainWindow.loadFile(indexPath, { hash: "/" });
  }

  mainWindow.webContents.on("did-finish-load", () => {
    notifyBoardWindowState();
  });

  mainWindow.on("close", (event) => {
    if (isQuitting) {
      return;
    }

    if (isGameActive()) {
      event.preventDefault();
      const choice = dialog.showMessageBoxSync(mainWindow, {
        type: "warning",
        buttons: ["Cancel", "End game and quit"],
        defaultId: 0,
        cancelId: 0,
        title: "Confirm Exit",
        message: "A game is currently in progress.",
        detail:
          "If you quit now, all current game progress and scores will be lost. Are you sure you want to quit?",
      });

      if (choice === 1) {
        isQuitting = true;
        app.quit();
      }
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
    if (boardWindow && !boardWindow.isDestroyed()) {
      boardWindow.close();
    }
  });
};

app.on("before-quit", (event) => {
  if (isQuitting) {
    return;
  }
  if (isGameActive()) {
    event.preventDefault();
    const parentWin =
      mainWindow && !mainWindow.isDestroyed() ? mainWindow : boardWindow;
    const choice = dialog.showMessageBoxSync(parentWin, {
      type: "warning",
      buttons: ["Cancel", "End game and quit"],
      defaultId: 0,
      cancelId: 0,
      title: "Confirm Exit",
      message: "A game is currently in progress.",
      detail:
        "If you quit now, all current game progress and scores will be lost. Are you sure you want to quit?",
    });

    if (choice === 1) {
      isQuitting = true;
      app.quit();
    }
  }
});

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
ipcMain.handle("updateCollection", async (_event, id, title) => {
  const result = await Service.updateCollection(id, title);
  if (gameLogic.getCollectionId() === Number(id)) {
    await gameLogic.setCurrentCollection(id);
  }
  return result;
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
  currentSession = null;
  gameState.status = GAME_STATUS.IDLE;
  gameState.renderVersion++;
  safeSend(mainWindow, "undoRedoState", false, false);
  await gameLogic.setGameData(team1, team2, questionsId);
  return true;
});
ipcMain.handle("isGameActive", () => isGameActive());
ipcMain.handle("isBoardOpen", () =>
  Boolean(boardWindow && !boardWindow.isDestroyed())
);
ipcMain.handle("openBoardWindow", () => {
  createBoardWindow();
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
  if (currentSession) {
    currentSession.navigate(1);
    gameState.index = currentSession.currentIndex;
    renderCurrentRound();
  }
});
ipcMain.on("prevQuestion", () => {
  if (currentSession) {
    currentSession.navigate(-1);
    gameState.index = currentSession.currentIndex;
    renderCurrentRound();
  }
});
ipcMain.on("guessAnswer", async (_event, id) => {
  if (currentSession) {
    currentSession.executeCommand(new GuessAnswerCommand(id));
    const round = currentSession.getCurrentRound();
    const ans = round && round.answers.find((a) => a.id === id);
    if (ans) {
      safeSend(
        boardWindow,
        "exposeAnswerOnBoard",
        ans.content + " " + ans.points,
        ans.id,
        ans.points
      );
    }
    renderCurrentRound();
  }
});
ipcMain.on("exposeAnswer", async (_event, id) => {
  if (currentSession) {
    currentSession.executeCommand(new ExposeAnswerCommand(id));
    const round = currentSession.getCurrentRound();
    const ans = round && round.answers.find((a) => a.id === id);
    if (ans) {
      safeSend(
        boardWindow,
        "exposeAnswerOnBoard",
        ans.content + " " + ans.points,
        ans.id
      );
    }
    renderCurrentRound();
  }
});
ipcMain.on("wrongAnswer", (_event, team) => {
  if (currentSession) {
    const side = team && team.teamColor === "BLUE" ? "BLUE" : "RED";
    currentSession.executeCommand(new StrikeCommand(side));
    safeSend(boardWindow, "wrongAnswer", side.toLowerCase());
    renderCurrentRound();
  }
});
ipcMain.on("win", (_event, team) => {
  if (currentSession) {
    currentSession.executeCommand(new AwardRoundCommand(team));
    renderCurrentRound();
  }
});
ipcMain.on("undoGameAction", () => {
  if (currentSession && gameState.status === GAME_STATUS.ACTIVE) {
    currentSession.undo();
    gameState.index = currentSession.currentIndex;
    renderCurrentRound();
  }
});
ipcMain.on("redoGameAction", () => {
  if (currentSession && gameState.status === GAME_STATUS.ACTIVE) {
    currentSession.redo();
    gameState.index = currentSession.currentIndex;
    renderCurrentRound();
  }
});
ipcMain.on("deleteCurrentCollection", () => {
  gameState.status = GAME_STATUS.IDLE;
  gameState.questions = [];
  gameState.index = 0;
  gameState.renderVersion++;
  pointsForQuestion = 0;
  currentSession = null;
  gameLogic.clearData();
  safeSend(mainWindow, "undoRedoState", false, false);
  safeSend(boardWindow, "displayQuestion", "");
  safeSend(boardWindow, "displayPointsForQuestion", 0);
  safeSend(boardWindow, "displayLostChances", 0, 0);
  safeSend(boardWindow, "syncBoardAnswers", []);
  safeSend(boardWindow, "statsTeam", "RED", "BLUE", 0, 0);
});

async function startGame() {
  if (gameState.status === GAME_STATUS.ACTIVE && currentSession) {
    renderCurrentRound();
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

    const questionsWithAnswers = [];
    for (const q of questions) {
      const qId = q.dataValues ? q.dataValues.id : q.id;
      const qContent = q.dataValues ? q.dataValues.content : q.content;
      const rawAnswers = await Service.getAnswers(qId);
      const sorted = rawAnswers.sort(sortAnswersByPoints).map((a) => ({
        id: a.dataValues ? a.dataValues.id : a.id,
        content: a.dataValues ? a.dataValues.content : a.content,
        points: a.dataValues ? a.dataValues.points : a.points,
      }));
      questionsWithAnswers.push({
        id: qId,
        content: qContent,
        answers: sorted,
      });
    }

    currentSession = new GameSession(
      gameLogic.getTeamRed(),
      gameLogic.getTeamBlue(),
      questionsWithAnswers
    );

    gameState.status = GAME_STATUS.ACTIVE;
    renderCurrentRound();
  } catch (error) {
    gameState.status = GAME_STATUS.IDLE;
    console.error("Unable to start game", error);
  }
}

function renderCurrentRound() {
  if (!currentSession) {
    return;
  }

  const round = currentSession.getCurrentRound();
  if (!round) {
    return;
  }

  const isFirst = currentSession.currentIndex === 0;
  const isLast =
    currentSession.currentIndex === currentSession.rounds.length - 1;
  const isAwarded = round.winner !== null;

  // 1. Host Console
  safeSend(
    mainWindow,
    "displayQuestionMain",
    round.content,
    isFirst,
    isLast,
    round.roundPoints,
    isAwarded
  );
  safeSend(mainWindow, "displayPointsForQuestion", round.roundPoints);
  safeSend(mainWindow, "syncRoundAnswers", round.answers);
  safeSend(
    mainWindow,
    "displayLostChances",
    round.lostChances.RED,
    round.lostChances.BLUE
  );
  safeSend(
    mainWindow,
    "statsTeam",
    currentSession.teams.RED.name,
    currentSession.teams.BLUE.name,
    currentSession.teams.RED.points,
    currentSession.teams.BLUE.points
  );
  safeSend(
    mainWindow,
    "undoRedoState",
    currentSession.canUndo(),
    currentSession.canRedo()
  );

  // 2. Audience Scoreboard
  safeSend(boardWindow, "displayQuestion", round.content);
  safeSend(boardWindow, "displayPointsForQuestion", round.roundPoints);
  safeSend(boardWindow, "syncBoardAnswers", round.answers);
  safeSend(
    boardWindow,
    "displayLostChances",
    round.lostChances.RED,
    round.lostChances.BLUE
  );
  safeSend(
    boardWindow,
    "statsTeam",
    currentSession.teams.RED.name,
    currentSession.teams.BLUE.name,
    currentSession.teams.RED.points,
    currentSession.teams.BLUE.points
  );
}

function sortAnswersByPoints(a, b) {
  const pointsA = a.dataValues ? a.dataValues.points : a.points;
  const pointsB = b.dataValues ? b.dataValues.points : b.points;
  return Number(pointsB) - Number(pointsA);
}
