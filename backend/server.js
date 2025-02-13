const express = require('express');
const app = express();
const cors = require('cors');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../database/games.db', (err) => {
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

const corsOptions = {
    origin: "*"
};
app.use(cors(corsOptions));
app.use(express.json());

app.post('/api/create-game', (req, res) => 
{
    const gamePin = Math.floor(100000 * Math.random());
    const rounds = req.body.rounds;
    const players = JSON.stringify([req.body.username]);
    const host = req.body.username;

    db.run(`INSERT INTO games (pin, rounds, players, host) VALUES (?, ?, ?, ?)`, [gamePin, rounds, players, host]);
    res.json({gamePin});
});

app.post('/api/join-game', (req, res) =>
{
    const username = req.body.username;
    const gamePin = req.body.gamePin;
    db.get("SELECT players FROM games WHERE pin = ?", [gamePin], (err, { players } = {}) =>
    {
        if (!players)
            return res.status(404).json({ success: false, error: "Game not found" });
        let playerArr = JSON.parse(players);
        if (playerArr.includes(username))
            return res.status(404).json({ success: false, error: "Username already taken" });
        playerArr.push(username);
        db.run("UPDATE games SET players = ? WHERE pin = ?", [JSON.stringify(playerArr), gamePin]);
        res.json({ success: true});
    });
})

app.get('/api/create-game', (req, res) => 
{
    console.log('Works');
    res.json({ "Success": "works" });
});

app.listen(5001);