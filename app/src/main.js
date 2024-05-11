const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('fs');
const Question = require('../src/model/question');
const Answer = require('../src/model/answer');
const Team = require('../src/model/team');

var mainWindow;

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'render/formStart.html'));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
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
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// IPC handles
ipcMain.on("createNewSet", createNewSet);
ipcMain.on("toStartPage", ()=>{
  mainWindow.loadURL(`file://${__dirname}/render/formStart.html`)
})

function createNewSet(event, fileName){
  var path = "sets/"+fileName+".txt";
  fs.open(path, 'w', function (err, file) {
    if (err) throw err;
    // console.log('Saved!');
  });
  mainWindow.loadURL(`file://${__dirname}/render/questions.html`)
}


var questions = [];
var teamRed, teamBlue;
