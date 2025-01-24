import React from 'react';
import { useState} from 'react'
import LogoHomeScreen from '../components/LogoHomeScreen';
import Button from '../components/Button';

function JoinGame({onNavigate})
{
  const [gamePin, setGamePin] = useState('');
  const [isShaking, setShaking] = useState(false);

  function triggerShake()
  {
    setShaking(true);
    setTimeout(() => {setShaking(false)}, 500);
  };

  return (
    <div>
      <LogoHomeScreen/>
      <div className='font-bold w-[375px] h-[812px] flex justify-center items-center flex-col gap-3'>
        <input className={`w-[90%] text-base py-4 bg-[#c3cfc7] rounded-[25px] text-gray-400 text-center px-4 placeholder-italic ${isShaking ? 'shake' : ''}`} type="text" name="gamepin" placeholder="Game PIN" onChange={(e) => setGamePin(e.target.value)}></input>
        <Button className={'shadow-2xl'} text="Join game" onClick={() => gamePin ? onNavigate('game-lobby') : triggerShake()}/>
      </div>
    </div>
  );
}

export default JoinGame;