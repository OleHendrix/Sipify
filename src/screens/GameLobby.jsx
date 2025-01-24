import React from 'react';
import Button from '../components/Button';
import GameBackground from '../components/GameBackground';

function GameLobby({onNavigate, username, rounds})
{
  const gamePin = Math.floor(100000 * Math.random());

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
          <p className='text-[16px] text-white'>{username}</p>
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