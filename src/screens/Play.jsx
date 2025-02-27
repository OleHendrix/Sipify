import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import React from 'react';
import Button from '../components/Button';
import GameBackground from '../components/GameBackground';
import socket from "../client_socket";
import Lottie from "lottie-react";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

function addScript()
{
  console.log("YES HOST :)");
  if (!window.Spotify)
  {
    window.onSpotifyWebPlaybackSDKReady = () =>
    {
      console.log("✅ Spotify Web Playback SDK is geladen!");
      const player = new window.Spotify.Player(
        {
          name: "SpotifyRoulette",

        }
      )
    };
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);
  }
}

function Play()
{
  const { gamePin } = useParams();
  useEffect(() =>
  {
    const addSpotifyPlayer = async () =>
    {
      const response = await axios.post("http://localhost:5001/api/games/host", { gamePin });
      const host = response.data.host;
      console.log(localStorage.getItem('username'));
      if (localStorage.getItem('username') != host)
        return;
      addScript();
    }
    addSpotifyPlayer();
  }, [gamePin]);
 
    return (
    <div className='relative w-[375px] h-[812px] overflow-hidden z-[0]'>
        <GameBackground/>
    </div>
  )
}

export default Play;