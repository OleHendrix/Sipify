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

function useGameLobby()
{
  const {gamePin} = useParams();
  const [players, setPlayers] = useState([]);
  const [rounds, setRounds] = useState(0);

  useEffect(() =>
  {
    socket.connect();
    return () => {socket.disconnect();};
  }, []);

  useEffect(() => {
  async function fetchGame()
  {
    try
    {
      const response = await axios.post("http://localhost:5001/api/games/get", { gamePin });
      setPlayers(response.data.players);
      setRounds(response.data.rounds); 
    }
    catch (err)
    {
      console.error("Error fetching game");
      return ;
    }
  }
  fetchGame();
  const handleUpdatePlayers = (newPlayers) => {
        setPlayers(newPlayers);
    };

    socket.on(`update-players${gamePin}`, handleUpdatePlayers);

    return () => {
        socket.off(`update-players${gamePin}`, handleUpdatePlayers);
    };
}, [gamePin]);
  return { gamePin, players, rounds };
}

async function getTracks(accessToken)
{
    let tracks = [];
    let url = "https://api.spotify.com/v1/me/tracks?offset=0&limit=20";

    try 
    {
      while (url)
      {
        const response = await axios.get(url,
        {
          headers: { Authorization: `Bearer ${accessToken}`}
        });
        tracks = tracks.concat(response.data.items);
        url = response.data.next;  
      }
      return tracks;
    }
    catch (error)
    {
      console.error("❌ Error fetching tracks:", error);
      return [];
    }
}


async function setTracksInDatabase(username, gamePin, tracks)
{
  try
  {
    const response = await axios.post("http://localhost:5001/api/spotify/add_tracks", {username, gamePin, tracks});
    console.log(response.data);
  }
  catch (err)
  {
    console.log(err);
  }
}


function GameLobby()
{
  const { gamePin, players, rounds } = useGameLobby();
  const [spotifyConnected, setSpotifyConnected] = useState(false);
  const [loadState, setLoadState] = useState(0);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => 
  {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get("access_token");
    const username = urlParams.get("username");
    setUsername(urlParams.get("username"));
    if (accessToken)
    {
      localStorage.setItem("spotifyAccessToken", accessToken);
      setSpotifyConnected(true);
      const fetchTracks = async () =>
      {
        setLoadState(1);
        const tracks = await getTracks(accessToken);
        setTracksInDatabase(username, gamePin, tracks);
        const response = await axios.post("http://localhost:5001/api/games/update-load", { username, gamePin });
        setLoadState(2);
      };
      fetchTracks();
    }
    else
    {
      if (localStorage.getItem("spotifyAccessToken"))
        setSpotifyConnected(true);
    }
  }, []);
  
  return (
    <div className='relative w-[375px] h-[812px] overflow-hidden z-[0]'>
      <GameBackground/>
      <div className='font-bold w-[375px] h-[812px] flex flex-col justify-between p-8'>
        <div className='flex flex-col items-center'>
          <h2 className='text-[18px] text-gray-400'>Game PIN</h2>
          <h2 className='text-[32px] text-white'>{gamePin}</h2>
          <Button className={'shadow-2xl'} text="Invite friends"/>
          {loadState === 1 && (<p className="text-[12px] text-white mt-2">Importing tracks...</p>)}
          {loadState === 1 && (<Loader className={'mt-4'}/>)}
          {loadState === 2 && (<p className="text-[12px] text-white mt-2">Tracks imported!</p>)}
        </div>
        <div className='flex flex-col items-center'>
          {players.map((player, index) => <p key={index} className={`text-[20px] text-white ${player.isLoading ? "opacity-50" : ""}`}>{player.username}</p>)}
        </div>
        <div className='flex flex-col items-center space-y-2'>
          <p className='text-[16px] text-white'>{rounds} rounds</p>
          <Button className={'shadow-2xl'} text="Start game" onClick={() => {players.every(player => player.isLoading === 1) && navigate(`/play/${gamePin}`)}}/>
        </div>
      </div>
    </div>
  )
}

export default GameLobby;