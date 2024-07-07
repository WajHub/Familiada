const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const sequelize = require('../database/sequelize');
const Service = require('./service');
const gameLogic = require('./gameLogic');

var mainWindow;
var boardWindow;


// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  boardWindow = new BrowserWindow({
    width: 600,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  boardWindow.loadFile(path.join(__dirname, 'render/board.html'));

    // Create the browser window.
    mainWindow = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js'),
      },
    });
  
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, 'render/index.html'));

  // Open the DevTools.
  boardWindow.webContents.openDevTools();
  mainWindow.webContents.openDevTools();

  module.exports = { boardWindow };
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {

  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    sequelize.close() 
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.



// IPC handles for index.html
ipcMain.handle('getCollections', Service.getCollections);
ipcMain.on("saveCollection", Service.saveCollection);
ipcMain.handle('deleteCollection', Service.deleteCollection);
ipcMain.on("setCurrentCollection", gameLogic.setCurrentCollection);


// IPC handles for Questions.html
ipcMain.on("addNewQuestion", gameLogic.addNewQuestion);
ipcMain.handle("getCollectionTitle", gameLogic.getCollectionTitle);
ipcMain.handle("get_questions", async (event) => {
  const collectionId = gameLogic.getCollectionId();
  return await Service.getQuestions(collectionId);
});
ipcMain.handle("get_answers", Service.getAnswers);
ipcMain.on("setTeams", gameLogic.setTeams);
ipcMain.on("startGame", startGame);

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startGame(event) {
  var nextQuestion = false;
  var indexOfQuestion = 0;

  ipcMain.on("nextQuestion", (event) => {
    nextQuestion = true;
    indexOfQuestion++;
  });
  ipcMain.on("prevQuestion", (event) => {
    nextQuestion = true;
    indexOfQuestion--;
  });

  gameLogic.getQuestions().then(async (questions) => { 
    for (; indexOfQuestion < questions.length; ) {
      var question = questions[indexOfQuestion];
  
      boardWindow.webContents.send("displayQuestion", question.content);
      mainWindow.webContents.send("displayQuestion", question.content);

      var index = 0;
      Service.getAnswers(null, question.id).then((answers) => {
        for (const answer of answers) {
          mainWindow.webContents.send("displayAnswer", answer.content, index);
          index++;
          boardWindow.webContents.send("displayHiddenAnswer", index);
        }
      });
    
      nextQuestion = false;
      while (!nextQuestion) {
        await delay(1000); 
      }
    }
  });
}






