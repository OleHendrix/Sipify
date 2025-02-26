import React from 'react';
import LogoHomeScreen from '../components/LogoHomeScreen';
import Button from '../components/Button';
import Lottie from "lottie-react";
import Link from "../assets/Link.json";
import Music from "../assets/Music.json";
import Rocket from "../assets/Rocket.json";
import { useNavigate } from "react-router-dom";

function StartScreen({onNavigate})
{
  const navigate = useNavigate();

  return (
    <div className='h-[812px]'>
      <LogoHomeScreen/>
      <div className='h-full flex items-center justify-center'>
      <div className="font-bold bg-black/40 rounded-[40px] p-4 w-[90%] shadow-2xl">
        <h2 className="text-[18px] text-gray-400 flex justify-center mb-4">How it works.</h2>
        
        <div className="flex items-start gap-2.5 mb-4">
          <Lottie animationData={Link} className="w-[40px] h-[40px] min-w-[50px] flex items-center justify-center"/>
          <div className="text-[14px] text-gray-400 mb-1">
            <h3>Connect Your Spotify</h3>
            <p className="text-[12px] pb-1 text-white leading-relaxed border-b border-white border-opacity-15">The game imports all of your liked songs from Spotify.</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 mb-4">
          <Lottie animationData={Music} className="w-[40px] h-[40px] min-w-[50px] flex items-center justify-center"/>
          <div className="text-[14px] text-gray-400 mb-1">
            <h3>Listen & Guess</h3>
            <p className="text-[12px] pb-1 text-white leading-relaxed border-b border-white border-opacity-15">A random track will be played from a random player in your group.</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 mb-4">
         <Lottie animationData={Rocket} className="w-[40px] h-[40px] min-w-[50px] flex items-center justify-center"/>
          <div className="text-[14px] text-gray-400 mb-1">
            <h3>Guess the player</h3>
            <p className="text-[12px] pb-1 text-white leading-relaxed border-b border-white border-opacity-15">Guess the player which liked song is played and become the winner.</p>
          </div>
        </div>

        <div className="font-normal text-[9px] text-white/60 text-center">
          <p>By continuing, you accept our <a href="#" className="font-bold text-[#1DB954]">terms of use</a> and <a href="#" className="font-bold text-[#1DB954]">privacy policy</a>.</p>
        </div>
        <div className="w-full flex justify-center mt-2">
          <Button className="mb-2.5" text="Continue" onClick={() => navigate('/login')}/>
        </div>
      </div>
      </div>
    </div>
  );
}

export default StartScreen;