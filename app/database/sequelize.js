const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

let dbPath = path.join(__dirname, 'database.sqlite');

try {
  const electron = require('electron');
  const app = electron.app || (electron.remote && electron.remote.app);
  if (app && app.isPackaged) {
    const userDataPath = app.getPath('userData');
    if (!fs.existsSync(userDataPath)) {
      fs.mkdirSync(userDataPath, { recursive: true });
    }
    dbPath = path.join(userDataPath, 'database.sqlite');
    const shouldCopy = !fs.existsSync(dbPath) || fs.statSync(dbPath).size === 0;
    if (shouldCopy) {
      const templatePath = path.join(__dirname, 'database.sqlite');
      if (fs.existsSync(templatePath)) {
        fs.copyFileSync(templatePath, dbPath);
      }
    }
  }
} catch (e) {
  console.error('Error configuring SQLite database path:', e);
}

// Inicjalizacja Sequelize
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: false,
});

module.exports = sequelize;
