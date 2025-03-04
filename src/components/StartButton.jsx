import React from 'react';
import Button from '../components/Button';

function StartButton({ host, isHost, setStartGame })
{
    return (
        <div className='font-bold w-[375px] h-[812px] flex flex-col items-center justify-center p-8 text-left'>
            <p className='text-[32px] text-green-500 text-left w-[80%]'>{host},</p>
            <p className='text-[16px] text-white text-left w-[80%]'>Please start the game!</p>
            {isHost && <Button className={`shadow-2xl mt-2`} text='Start' onClick={() => setStartGame(false)}/>}
        </div>
    )
}

export default StartButton