import React from 'react';
import { useState} from 'react'
import LogoHomeScreen from '../components/LogoHomeScreen';
import Button from '../components/Button';
import axios from "axios";
import { useNavigate } from "react-router-dom";

async function postJoinGame(username, gamePin, navigate, triggerShake)
{
  if (!gamePin)
    triggerShake();
  else
  {
    try 
    {
      const response = await axios.post('http://localhost:5001/api/games/join', {username: username, gamePin: gamePin});
      if (response.data.success)
        navigate(`/game-lobby/${gamePin}`);
      else
      {
        triggerShake();
        console.warn("Join game failed:", response.data.error);
      }
    } 
      catch (error)
      {
        triggerShake();
        console.error("API request failed:", error.message);
      }
  }
}

function JoinGame({username})
{
  const [gamePin, setGamePin] = useState('');
  const [isShaking, setShaking] = useState(false);
  const navigate = useNavigate();

  function triggerShake()
  {
    setShaking(true);
    setTimeout(() => {setShaking(false)}, 500);
  };

  return (
    <div>
      <LogoHomeScreen/>
      <div className='font-bold w-[375px] h-[812px] flex justify-center items-center flex-col gap-3'>
        <input className={`w-[90%] text-base py-4 bg-[#c3cfc7] rounded-[25px] text-gray-700 text-center px-4 placeholder-italic placeholder-gray-400 ${isShaking ? 'shake' : ''}`} type="text" name="gamepin" placeholder="Game PIN" onChange={(e) => setGamePin(e.target.value)}></input>
        <Button className={'shadow-2xl'} text="Join game" onClick={() => postJoinGame(username, gamePin, navigate, triggerShake())}/>
      </div>
    </div>
  );
}

export default JoinGame;