const Database = require("better-sqlite3")
const path = require("path")

const dbPath = "./database.db";
const db = new Database(dbPath)
db.pragma("journal_mode = WAL")

try {
    db.prepare('SELECT 1').get();
    console.log('Connected to the SQLite database.');
} catch (error) {
    console.error('Unable to connect to the SQLite database:', error);
}

exports.db = db