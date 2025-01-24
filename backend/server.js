const express = require('express');
const app = express();
const cors = require('cors');

const corsOptions = {
    origin: "*"
};
app.use(cors(corsOptions));
app.use(express.json());

const games = {};

app.post('/api/create-game', (req, res) => 
{
    const gamePin = Math.floor(100000 * Math.random());
    games[gamePin] = {players: [req.body.username], rounds: req.body.rounds};
    console.log(games[gamePin]);
    res.json({gamePin});
});

app.get('/api/create-game', (req, res) => 
{
    console.log('Works');
    res.json({ "Success": "works" });
});

app.listen(5001);