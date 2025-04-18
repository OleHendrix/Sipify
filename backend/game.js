import express from "express";
// import db from "./database.js";
import supabase from "./supabase.js";
import { io } from "./server.js";

const router = express.Router();

router.post("/create", async (req, res) =>
{
    const gamePin = Math.floor(100000 * Math.random()); //check of gamePin niet al in db zit.
    const rounds = req.body.rounds;
    const host = req.body.username;

    const { data, error} = await supabase.from('games').insert([{id: gamePin, rounds, host}]);
    if (error)
        return (res.status(500).json({ error: "Could not create game" }));
    const { error: playerError } = await supabase.from('players').insert([{username: host, gamePin, isLoading: true }]);
    if (playerError)
        return (res.status(500).json({ error: "Could add host to player table" }));
    res.json({gamePin});
})


// router.post("/create", (req, res) =>
// {
//     const gamePin = Math.floor(100000 * Math.random()); //check of gamePin niet al in db zit.
//     const rounds = req.body.rounds;
//     const host = req.body.username;

//     db.run(`INSERT INTO games (pin, rounds, host) VALUES (?, ?, ?)`, [gamePin, rounds, host], (err) =>
//     {
//         if (err)
//             return (res.status(500).json({ error: "Could not create game" }));
//         db.run(`INSERT INTO players (username, gamePin, isLoading) VALUES (?, ?, 1)`, [host, gamePin], (err) =>
//         {
//             if (err)
//                 return (res.status(500).json({ error: "Could not create game" }));
//             res.json({gamePin});
//         }); 
//     });
// })

router.post("/join", async (req, res) =>
{
    const { username, gamePin } = req.body;

    // 1️⃣ Check of de game bestaat
    const { data: game, error: gameError } = await supabase.from('games').select('id').eq('id', gamePin).single();
    if (!game)
        return res.status(404).json({ success: false, error: "Game not found" });

    // 2️⃣ Check of de speler al in de game zit
    const { data: player, error: playerError } = await supabase.from('players').select('username').eq('username', username).eq('gamePin', gamePin).single();
    if (player)
        return res.status(400).json({ error: "Player already in game" });

    // 3️⃣ Voeg de speler toe aan de game
    const { data: newPlayer, error: insertError } = await supabase.from('players').insert([{ username, gamePin, isLoading: true }]);
    if (insertError)
        return res.status(500).json({ error: "Could not add player" });

    // 4️⃣ Haal alle spelers op voor deze game
    const { data: players, error: fetchError } = await supabase.from('players').select('username, isLoading').eq('gamePin', gamePin);
    if (fetchError)
        return res.status(500).json({ error: "Could not retrieve players" });

    // 5️⃣ Stuur een update naar alle clients
    io.emit(`update-players${gamePin}`, players);

    // 6️⃣ Stuur een succesvolle response terug
    res.json({ success: true });
});



// router.post("/join", (req, res) => {
//     const { username, gamePin } = req.body;

//     db.get("SELECT pin FROM games WHERE pin = ?", [gamePin], (err, row) => {
//         if (!row) return res.status(404).json({ success: false, error: "Game not found" });

//         db.get(`SELECT username FROM players WHERE username = ? AND gamePin = ?`, [username, gamePin], (err, player) => {
//             if (player) return res.status(400).json({ error: "Player already in game" });

//             db.run(`INSERT INTO players (username, gamePin, isLoading) VALUES (?, ?, 1)`, [username, gamePin], function (err) {
//                 if (err) return res.status(500).json({ error: "Could not add player" });

//                 db.all("SELECT username, isLoading FROM players WHERE gamePin = ?", [gamePin], (err, rows) => {
//                     if (err) return res.status(500).json({ error: "Could not retrieve players" });
//                     io.emit(`update-players${gamePin}`, rows);
//                 });
//                 res.json({ success: true });
//             });
//         });
//     });
// });
     
router.post("/update-load", async (req, res) =>
{
    const {username, gamePin } = req.body;
    const {error: updatePLayersError} = await supabase.from('players').update({ isLoading: false }).eq('username', username).eq('gamePin', gamePin);
    if (updatePLayersError)
        return res.status(500).json({ error: "Could not update status"});
    const {data: players, error: playersError} = await supabase.from('players').select('username, isLoading').eq('gamePin', gamePin);
    if (playersError)
         return res.status(500).json({ error: "Could not retrieve players" });
    io.emit(`update-players${gamePin}`, players);
    res.json({ success: true});
})


// router.post("/update-load", (req, res) =>
// {
//     const {username, gamePin } = req.body;
//     db.run("UPDATE players SET isLoading = ? WHERE username = ? AND gamePin = ?", [0, req.body.username, req.body.gamePin], (err) =>
//     {
//         if (err)
//             return res.status(500).json({ error: "Could not update status"});
//         db.all("SELECT username, isLoading FROM players WHERE gamePin = ?", [req.body.gamePin], (err, rows) =>
//         {
//             if (err)
//                 return res.status(500).json({ error: "Could not retrieve players" });
//             io.emit(`update-players${req.body.gamePin}`, rows);
//             res.json({ success: true });
//         });
//     });
// })


router.post("/get", async (req, res) =>
{
    const gamePin = req.body.gamePin;
    const { data, error } = await supabase.from('games').select('rounds').eq('id', gamePin).single();
    if (error)
        return res.status(404).json({ success: false, error: "Error getting rounds" });
    const rounds = data.rounds;
    const {data: players, error: playersError} = await supabase.from('players').select('username, isLoading').eq('gamePin', gamePin);
    if (playersError)
        return res.status(404).json({ success: false, error: "Error getting players" });
    res.json({players: players, rounds: rounds});
})

// router.post("/get", (req, res) =>
// {
//     const gamePin = req.body.gamePin;

//     db.get("SELECT rounds FROM games WHERE pin = ?", [gamePin], (err, row) =>
//     {
//         const rounds = row.rounds;
//         db.all("SELECT username, isLoading FROM players WHERE gamePin = ?", [req.body.gamePin], (err, rows) =>
//         {
//             if (err)
//                 return res.status(500).json({ success: false, error: "Error" });
//             res.json({players: rows, rounds: rounds});
//         });
//     })
// })

router.post("/host", async (req, res) =>
{
    const gamePin = req.body.gamePin;
    const { data, error } = await supabase.from('games').select('host').eq('id', gamePin).single();
    if (error)
        return res.status(500).json({ success: false, error: "Error" });
    res.json({host: data.host});
})

// router.post("/host", (req, res) =>
// {
//     const gamePin = req.body.gamePin;

//     db.get("SELECT host FROM games WHERE pin = ?", [gamePin], (err, row) =>
//     {
//         if (err || !row)
//             return res.status(500).json({ success: false, error: "Error" });
//         const host = row.host;
//         res.json({host: host});
//     })
// })
        
export default router;