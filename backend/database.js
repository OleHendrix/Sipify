import sqlite3 from "sqlite3";

const db = new sqlite3.Database('./games.db', (err) =>
{
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

db.run(`CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY,
    pin INTEGER UNIQUE,
    rounds INTEGER,
    players TEXT,
    host TEXT)`);

export default db;