const { Sequelize } = require('sequelize');
const path = require('path');

// Konfiguracja ścieżki do pliku bazy danych SQLite
const dbPath = path.join(__dirname, 'database.sqlite');

// Inicjalizacja Sequelize
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath
});

// Test połączenia z bazą danych
// (async () => {
//     try {
//         await sequelize.authenticate();
//         console.log('Connected to the SQLite database using Sequelize.');
//     } catch (error) {
//         console.error('Unable to connect to the SQLite database:', error);
//     }
// })();

module.exports = sequelize;
