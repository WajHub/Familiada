const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

let dbPath = path.join(__dirname, 'database.sqlite');

try {
  const electron = require('electron');
  const app = electron.app || (electron.remote && electron.remote.app);
  if (app && app.isPackaged) {
    const userDataPath = app.getPath('userData');
    dbPath = path.join(userDataPath, 'database.sqlite');
    if (!fs.existsSync(dbPath)) {
      const templatePath = path.join(__dirname, 'database.sqlite');
      if (fs.existsSync(templatePath)) {
        fs.copyFileSync(templatePath, dbPath);
      }
    }
  }
} catch (e) {
  // Running outside Electron (e.g. sequelize CLI or tests)
}

// Inicjalizacja Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

module.exports = sequelize;
