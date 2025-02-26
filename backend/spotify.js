import express from "express";
import axios from "axios";
import db from "./database.js";

const router = express.Router();

// async function getAccessToken(authCode)
// {
//     const response = await axios.post("https://accounts.spotify.com/api/token",
//     new URLSearchParams({
//         grant_type: "authorization_code",
//         code: authCode,
//         redirect_uri: "http://localhost:5001/api/spotify/handle_redirect",
//         client_id: "3f9f6ea40d8c4a72bed1df132bb420ab",
//         client_secret: "0c460753d5644584a673fdf31f3db72e"
//     }).toString(),
//     {
//         headers: { "Content-Type": "application/x-www-form-urlencoded" }
//     });
//     const accessToken = response.data.access_token;
//     const refreshToken = response.data.refresh_token;

// return accessToken;
// }

router.get("/handle_redirect", async (req, res) =>
{
    const authCode = req.query.code;
    const stateData = JSON.parse(decodeURIComponent(req.query.state));
    const gamePin = stateData.gamePin;
    const username = stateData.username;
    if (!authCode)
        return res.status(400).json({error: "No authCode received" });
    try
    {
        const response = await axios.post("https://accounts.spotify.com/api/token",
        new URLSearchParams({
        grant_type: "authorization_code",
        code: authCode,
        redirect_uri: "http://localhost:5001/api/spotify/handle_redirect",
        client_id: "3f9f6ea40d8c4a72bed1df132bb420ab",
        client_secret: "0c460753d5644584a673fdf31f3db72e"
        }).toString(),
        {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        const accessToken = response.data.access_token;
        const refreshToken = response.data.refresh_token;
        res.redirect(`http://localhost:5173/game-lobby/${gamePin}?access_token=${accessToken}&refresh_token=${refreshToken}&username=${encodeURIComponent(username)}`);
    }
    catch (error)
    {
        return res.status(500).json({error: "Error receiving token "});
    }
});

router.get("/login", (req, res) =>
{
    const { gamePin, username } = req.query;
    const authURL = `https://accounts.spotify.com/authorize?` +
        `client_id=3f9f6ea40d8c4a72bed1df132bb420ab` +
        `&response_type=code` +
        `&redirect_uri=http://localhost:5001/api/spotify/handle_redirect` +
        `&scope=playlist-read-private user-read-private user-read-email user-library-read` + 
        `&state=${encodeURIComponent(JSON.stringify({ gamePin, username }))}` +
        `&show_dialog=true`;
    res.redirect(authURL);
});

router.post("/add_tracks", (req, res) =>
{
    const {username, gamePin, tracks} = req.body;
    if (!username || !gamePin || !tracks)
        return res.status(400).json({ error: "Invalid request data" });
    db.get("SELECT id FROM players WHERE username = ? AND gamePin = ?", [username, gamePin], (err, player) =>
    {
        if (err || !player)
            return res.status(400).json({ error: "Player not found" });
        const player_id = player.id;
        for (let i = 0; i < tracks.length; i ++)
        {
            const track = tracks[i].track;
            const spotify_id = track.id;
            const title = track.name;
            const artist = track.artists.map(a => a.name).join(", ");
            const url = track.external_urls.spotify;

            db.get("SELECT id FROM tracks WHERE spotify_id = ?", [spotify_id], (err, exististingTrack) =>
            {
                if (err)
                {
                    console.error("DB error:", err);
                    return;
                }
                if (!exististingTrack)
                {
                    db.run("INSERT INTO tracks (spotify_id, title, artist, url) VALUES (?, ?, ?, ?)", [spotify_id, title, artist, url], function (err)
                    {
                        if (err)
                        {
                            console.error("Error inserting track", err);artist
                            return;
                        }
                        const track_id = this.lastID;
                        db.run("INSERT INTO playerTracks (player_id, gamePin, track_id) VALUES (?, ?, ?)", [player_id, gamePin, track_id], (err) =>
                        {
                            if (err)
                            {
                                console.error("Error inserting into playerTracks:", err);
                                return;
                            }
                        });
                    })
                }
                else
                {
                    db.run("INSERT INTO playerTracks (player_id, gamePin, track_id) VALUES (?, ?, ?)", [player_id, gamePin, exististingTrack.id], (err) =>
                    {
                        if (err)
                        {
                            console.error("Error inserting into playerTracks (existing)", err);
                            return;
                        }
                    });
                }
            });
        }
    });
    res.json({ success: true, message: "Tracks added!" });
});

export default router;


