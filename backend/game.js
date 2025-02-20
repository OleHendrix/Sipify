import express from "express";
import db from "./database.js";
import { io } from "./server.js";

const router = express.Router();

router.post("/create", (req, res) =>
{
    const gamePin = Math.floor(100000 * Math.random()); //check of gamePin niet al in db zit.
    const rounds = req.body.rounds;
    const players = JSON.stringify([req.body.username]);
    const host = req.body.username;

    db.run(`INSERT INTO games (pin, rounds, players, host) VALUES (?, ?, ?, ?)`, [gamePin, rounds, players, host]);
    res.json({gamePin});

})

router.post("/join", (req, res) =>
{
    const username = req.body.username;
    const gamePin = req.body.gamePin;
    db.get("SELECT * FROM games WHERE pin = ?", [gamePin], (err, row) =>
    {
        if (!row)
            return res.status(404).json({ success: false, error: "Game not found" });
        let playerArr = JSON.parse(row.players);
        if (playerArr.includes(username))
            return res.status(400).json({ success: false, error: "Username already taken" });
        playerArr.push(username);
        db.run("UPDATE games SET players = ? WHERE pin = ?", [JSON.stringify(playerArr), gamePin]);
        io.emit(`update-players${gamePin}`, playerArr);
        res.json({ success: true});
    });
})

router.post("/get", (req, res) =>
{
    db.get("SELECT * FROM games WHERE pin = ?", [req.body.gamePin], (err, row) =>
    {
        if (err || !row)
            return res.status(500).json({ success: false, error: "Error" });
        let playerArr = JSON.parse(row.players);
        res.json({
            succes: true,
            players: playerArr,
            rounds: row.rounds,
            host: row.host
        });
    });
})

export default router;