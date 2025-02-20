import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import React from 'react';
import Button from '../components/Button';
import GameBackground from '../components/GameBackground';
import socket from "../client_socket";

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
  socket.on(`update-players${gamePin}`, (newPlayers) => {setPlayers(newPlayers);});

  return () => {socket.off(`update-game-${gamePin}`);};
    }, [gamePin]
  );
  return { gamePin, players, rounds };
}


function GameLobby()
{
  const { gamePin, players, rounds } = useGameLobby();
  
  return (
    <div className='relative w-[375px] h-[812px] overflow-hidden z-[0]'>
      <GameBackground/>
      <div className='font-bold w-[375px] h-[812px] flex flex-col justify-between p-8'>
        <div className='flex flex-col items-center'>
          <h2 className='text-[18px] text-gray-400'>Game PIN</h2>
          <h2 className='text-[32px] text-white'>{gamePin}</h2>
          <Button className={'shadow-2xl'} text="Invite friends"/>
        </div>
        <div className='flex flex-col items-center'>
          {players.map((player, index) => <p key={index} className='text-[16px] text-white'>{player}</p>)}
        </div>
        <div className='flex flex-col items-center space-y-2'>
          <p className='text-[16px] text-white'>{rounds} rounds</p>
          <Button className={'shadow-2xl'} text="Start game"/>
        </div>
      </div>
    </div>
  )
}

export default GameLobby;