import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import React from 'react';
import Button from '../components/Button';
import GameBackground from '../components/GameBackground';
import StartButton from "../components/StartButton";
import socket from "../client_socket";
import Lottie from "lottie-react";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import Player from "../components/Player";
import SpotifyWebPlayer from 'react-spotify-web-playback';

let spotifyPlayer;

function addScript()
{
  if (!window.Spotify)
  {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    script.onload = () =>
    {
      console.log("✅ Spotify Web Playback SDK is geladen!");
    };
    document.body.appendChild(script);
  }
  else
    console.log("✅ Spotify SDK is al geladen!");
}

function initializeSpotifyPlayer()
{
  if (!window.Spotify || spotifyPlayer)
    return;

  const token = localStorage.getItem("spotifyAccessToken");
  if (!token)
  {
    console.error("❌ Geen Spotify-token gevonden!");
    return;
  }

  spotifyPlayer = new window.Spotify.Player(
  {
    name: "SpotifyRouletteNew2.0",
    getOAuthToken: (cb) => cb(token),
    volume: 0.5,
  });

  spotifyPlayer.addListener("ready", ({ device_id }) => {localStorage.setItem("spotifyDeviceId", device_id);});
  spotifyPlayer.connect();
}

async function playRandomTrack({ playingTrack })
{
  const token = localStorage.getItem("spotifyAccessToken");
  const deviceId = localStorage.getItem("spotifyDeviceId"); 

  if (!token || !deviceId)
  {
    console.error("❌ Geen geldige token of device ID!");
    return;
  }
  try
  {
    await axios.put
    (
      `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
      {
        uris: [`spotify:track:${playingTrack}`]
      },
      {
        headers:
        {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );
  }
  catch (error)
  {
    console.error("❌ Fout bij afspelen:", error.response?.data || error.message);
  }
}


function Play()
{
  const { gamePin } = useParams();
  const [playingTrack, setPlayingTrack] = useState('7GJnYYZjIi1fazoSJwqI1F');
  const [startGame, setStartGame] = useState(true);
  const [isHost, setIsHost] = useState(false);
  const [host, setHost] = useState('');

  useEffect(() =>
  {
    const addSpotifyPlayer = async () =>
    {
      const response = await axios.post("http://localhost:5001/api/games/host", { gamePin });
      setHost(response.data.host);
      if (localStorage.getItem("username") !== response.data.host)
        return;
      setIsHost(true);
      addScript();
      window.onSpotifyWebPlaybackSDKReady = initializeSpotifyPlayer; // ✅ Correcte initialisatie
      if (window.Spotify)
        initializeSpotifyPlayer(); // ✅ Direct starten als SDK al geladen is
    };

    addSpotifyPlayer();
    return (() =>
    {
      if (spotifyPlayer)
        spotifyPlayer.disconnect();
    });
  }, [gamePin]);

  return (
    <div className="relative w-[375px] h-[812px] overflow-hidden z-[0]">
        <GameBackground/>
        {startGame && <StartButton host={host} isHost={isHost} setStartGame={setStartGame}/>}
        
    </div>
  )
}

export default Play;