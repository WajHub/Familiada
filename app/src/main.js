const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');
const fs = require('fs');
const sequelize = require('../database/sequelize');
const { DataTypes } = require('sequelize');
const Answer = require('../models/answer')(sequelize, DataTypes);
const Question = require('../models/question')(sequelize, DataTypes);
const SetOfQuestions = require('../models/setOfQuestions')(sequelize, DataTypes);
const SetOfQuestionsService = require('../service/setOfQuestionsService');
const Team = require('../models/team');


var mainWindow;
var setOfQuestions;

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
  mainWindow.loadFile(path.join(__dirname, 'render/index.html'));

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
    sequelize.close() 
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.


// IPC handles
// StartForm ---------------
ipcMain.handle('get_sets', async () => {
  return await SetOfQuestions.findAll()
});
ipcMain.handle('delete_set', async (event, id) => {
  console.log("Deleting set with id: ", id);
    await SetOfQuestions.destroy({
      where: {
        id: id
      }
    });
});
ipcMain.on("set_chosen_set", async (event, id) => {
  console.log("Chosen set with id: ", id);
  setOfQuestions = await SetOfQuestions.findByPk(id);
  console.log("Set of questions: ", setOfQuestions);
});
ipcMain.on("save_new_set", async (event, title) => {
  SetOfQuestions.create({title: title}).
    then(set => {
      cosnole.log("Set created: ", set);
    });
});

// Questions ---------------
ipcMain.handle("get_setOfQuestions_title", async () => {
  return setOfQuestions.title;
});
ipcMain.handle("get_questions", async () => {
  return await Question.findAll({
    where: {
      setOfQuestionsId: setOfQuestions.id
    }
  });
});
ipcMain.handle("get_answers", async (event, id) => {
  return await Answer.findAll({
    where: {
      questionId: id
    }
  });
});
ipcMain.on("toStartPage", ()=>{
  mainWindow.loadURL(`file://${__dirname}/render/index.html`)
});
ipcMain.on("addNewQuestion", (event, question, answers, points)=>{
  Question.create({
    content: question,
    setOfQuestionsId: setOfQuestions.id
  });
  Question.findOne({
    where:{
      content: question
    }
  }).then(questionRespone => {
    for (i=0; i<answers.length; i++){
      Answer.create({
        content: answers[i],
        points: points[i],
        questionId: questionRespone.id
      });
    }
  });
});












