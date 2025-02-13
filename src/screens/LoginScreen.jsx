import React from 'react';
import { useState} from 'react'
import LogoHomeScreen from '../components/LogoHomeScreen'; 
import Button from '../components/Button'; 
import { useNavigate } from "react-router-dom";

function LoginScreen({setUserName, username})
{
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
        <input className={`w-[90%] text-base py-4 bg-[#c3cfc7] rounded-[25px] text-gray-700 text-center px-4 placeholder-gray-400 ${isShaking ? 'shake' : ''}`} type="text" name="username" placeholder="Your name" onChange={(e) => setUserName(e.target.value)}></input>
        <Button className='shadow-2xl' text="Create game" onClick={() => username ? navigate('/create-game') : triggerShake()}/>
        <Button className='shadow-2xl' text="Join game" onClick={() => username ? navigate('/join-game') : triggerShake()}/>
      </div>
    </div>
  );
}

export default LoginScreen;
