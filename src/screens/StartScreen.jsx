import React from 'react';
import LogoHomeScreen from '../components/LogoHomeScreen';
import Button from '../components/Button';
import spotifyIcon from '../assets/spotifyIcon.png';
import musicIcon from '../assets/musicIcon.png';
import gameIcon from '../assets/gameIcon.png';

function StartScreen({onNavigate})
{
  return (
    <div className='h-[812px]'>
      <LogoHomeScreen/>
      <div className='h-full flex items-center justify-center'>
      <div className="font-bold bg-black/40 rounded-[40px] p-4 w-[90%] shadow-2xl">
        <h2 className="text-[18px] text-gray-400 flex justify-center mb-4">How it works.</h2>
        
        <div className="flex items-start gap-2.5 mb-4">
          <img src={spotifyIcon} alt="Spotify" className="w-[50px] h-[50px] min-w-[50px] flex items-center justify-center" />
          <div className="text-[14px] text-gray-400 mb-1">
            <h3>Connect Your Spotify</h3>
            <p className="text-[12px] pb-1 text-white leading-relaxed border-b border-white border-opacity-15">The game imports your top songs from the past years.</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 mb-4">
         <img src={musicIcon} alt="Spotify" className="w-[50px] h-[50px] min-w-[50px] flex items-center justify-center" />
          <div className="text-[14px] text-gray-400 mb-1">
            <h3>Listen & Guess</h3>
            <p className="text-[12px] pb-1 text-white leading-relaxed border-b border-white border-opacity-15">You choose a detail (title, artist, or year) and guess it blind.</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5 mb-4">
         <img src={gameIcon} alt="Spotify" className="w-[50px] h-[50px] min-w-[50px] flex items-center justify-center" />
          <div className="text-[14px] text-gray-400 mb-1">
            <h3>Drink or Hand Out Sips</h3>
            <p className="text-[12px] pb-1 text-white leading-relaxed border-b border-white border-opacity-15">A correct guess lets you pick who drinks, a wrong guess means you drink.</p>
          </div>
        </div>

        <div className="font-normal text-[9px] text-white/60 text-center">
          <p>By continuing, you accept our <a href="#" className="font-bold text-[#1DB954]">terms of use</a> and <a href="#" className="font-bold text-[#1DB954]">privacy policy</a>.</p>
        </div>
        <div className="w-full flex justify-center mt-2">
          <Button className="mb-2.5" text="Continue" onClick={() => onNavigate('login')}/>
        </div>
      </div>
      </div>
    </div>
  );
}

export default StartScreen;