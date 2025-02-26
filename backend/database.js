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
    pin INTEGER PRIMARY KEY,
    rounds INTEGER,
    host TEXT)`);

db.run(`CREATE TABLE IF NOT EXISTS players (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    gamePin INTEGER,
    isLoading INTEGER default 1,                                       
    FOREIGN KEY (gamePin) REFERENCES games(pin) ON DELETE CASCADE)`);   //make isLoading Boolean

db.run(`CREATE TABLE IF NOT EXISTS tracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    spotify_id TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    url TEXT NOT NULL
    )`);

db.run(`CREATE TABLE IF NOT EXISTS playerTracks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    player_id INTEGER NOT NULL,
    gamePin INTEGER NOT NULL,
    track_id INTEGER NOT NULL,
    FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
    FOREIGN KEY (gamePin) REFERENCES games(pin) ON DELETE CASCADE,
    FOREIGN KEY (track_id) REFERENCES tracks(id) ON DELETE CASCADE
    )`);

export default db;