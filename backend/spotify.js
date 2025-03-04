import express from "express";
import axios from "axios";
import supabase from "./supabase.js";
// import db from "./database.js";

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
    const { gamePin, username, host } = req.query;
    console.log(host);
    const authURL = `https://accounts.spotify.com/authorize?` +
        `client_id=3f9f6ea40d8c4a72bed1df132bb420ab` +
        `&response_type=code` +
        `&redirect_uri=http://localhost:5001/api/spotify/handle_redirect` +
        `&scope=playlist-read-private user-read-private user-read-email user-library-read ${host ? 'streaming' : ''}` + 
        `&state=${encodeURIComponent(JSON.stringify({ gamePin, username }))}` +
        `&show_dialog=true`;
    res.redirect(authURL);
});

router.post("/add_tracks", async (req, res) =>
{
    const { username, gamePin, tracks } = req.body;

    if (!username || !gamePin || !tracks)
        return res.status(400).json({ error: "Invalid request data" });

    // 1️⃣ Check of speler bestaat
    const { data: player, error: playerError } = await supabase.from('players').select('id').eq('username', username).eq('gamePin', gamePin).single();
    if (playerError || !player)
        return res.status(400).json({ error: "Player not found" });

    const player_id = player.id;

    // 2️⃣ Loop door alle tracks heen
    for (let i = 0; i < tracks.length; i++)
    {
        const track = tracks[i].track;
        const spotify_id = track.id;
        const title = track.name;
        const artist = track.artists.map(a => a.name).join(", ");
        const url = track.external_urls.spotify;
        const { data: newTrack, error: insertTrackError } = await supabase.from('tracks').insert([{ spotify_id, title, artist, url }]).select('id').single();
        if (insertTrackError)
            continue;
        const track_id = newTrack.id;
        const { error: playerTrackError } = await supabase.from('playerTracks').insert([{ player_id, gamePin, track_id }]);
        if (playerTrackError)
            console.error("Error inserting into playerTracks:", playerTrackError);
    }
    res.json({ success: true, message: "Tracks added!" });
});


export default router;


