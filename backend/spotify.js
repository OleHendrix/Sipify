import express from "express";
import axios from "axios";

const router = express.Router();

let accessToken = null;
let timeTokenExpires = 0;

async function getAccessToken()
{
    if (!accessToken)
    {
        const response = await axios.post("https://accounts.spotify.com/api/token",
        new URLSearchParams({
            grant_type: "client_credentials",
            client_id: "3f9f6ea40d8c4a72bed1df132bb420ab",
            client_secret: "0c460753d5644584a673fdf31f3db72e"
        }).toString(),
        {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        accessToken = response.data.access_token;
        timeTokenExpires = Date.now() + response.data.expires_in * 1000;
    }
    return accessToken;
}

getAccessToken();

export default router;


