import express from "express";
import db from "./database.js";
import { io } from "./server.js";

const router = express.Router();

router.post("/create", (req, res) =>
{
    const gamePin = Math.floor(100000 * Math.random()); //check of gamePin niet al in db zit.
    const rounds = req.body.rounds;
    const host = req.body.username;

    db.run(`INSERT INTO games (pin, rounds, host) VALUES (?, ?, ?)`, [gamePin, rounds, host], (err) =>
    {
        if (err)
            return (res.status(500).json({ error: "Could not create game" }));
        db.run(`INSERT INTO players (username, gamePin, isLoading) VALUES (?, ?, 1)`, [host, gamePin], (err) =>
        {
            if (err)
                return (res.status(500).json({ error: "Could not create game" }));
            res.json({gamePin});
        }); 
    });
})

router.post("/join", (req, res) => {
    const { username, gamePin } = req.body;

    db.get("SELECT pin FROM games WHERE pin = ?", [gamePin], (err, row) => {
        if (!row) return res.status(404).json({ success: false, error: "Game not found" });

        db.get(`SELECT username FROM players WHERE username = ? AND gamePin = ?`, [username, gamePin], (err, player) => {
            if (player) return res.status(400).json({ error: "Player already in game" });

            db.run(`INSERT INTO players (username, gamePin, isLoading) VALUES (?, ?, 1)`, [username, gamePin], function (err) {
                if (err) return res.status(500).json({ error: "Could not add player" });

                db.all("SELECT username, isLoading FROM players WHERE gamePin = ?", [gamePin], (err, rows) => {
                    if (err) return res.status(500).json({ error: "Could not retrieve players" });
                    io.emit(`update-players${gamePin}`, rows);
                });
                res.json({ success: true });
            });
        });
    });
});
     

router.post("/update-load", (req, res) =>
{
    const {username, gamePin } = req.body;
    db.run("UPDATE players SET isLoading = ? WHERE username = ? AND gamePin = ?", [0, req.body.username, req.body.gamePin], (err) =>
    {
        if (err)
            return res.status(500).json({ error: "Could not update status"});
        db.all("SELECT username, isLoading FROM players WHERE gamePin = ?", [req.body.gamePin], (err, rows) =>
        {
            if (err)
                return res.status(500).json({ error: "Could not retrieve players" });
            io.emit(`update-players${req.body.gamePin}`, rows);
            res.json({ success: true });
        });
    });
})

router.post("/get", (req, res) =>
{
    const gamePin = req.body.gamePin;

    db.get("SELECT rounds FROM games WHERE pin = ?", [gamePin], (err, row) =>
    {
        const rounds = row.rounds;
        db.all("SELECT username, isLoading FROM players WHERE gamePin = ?", [req.body.gamePin], (err, rows) =>
        {
            if (err)
                return res.status(500).json({ success: false, error: "Error" });
            res.json({players: rows, rounds: rounds});
        });
    })
})

router.post("/host", (req, res) =>
{
    const gamePin = req.body.gamePin;

    db.get("SELECT host FROM games WHERE pin = ?", [gamePin], (err, row) =>
    {
        if (err || !row)
            return res.status(500).json({ success: false, error: "Error" });
        const host = row.host;
        res.json({host: host});
    })
})
        
export default router;