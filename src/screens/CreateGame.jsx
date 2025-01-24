import React from 'react';
import LogoHomeScreen from '../components/LogoHomeScreen';
import Button from '../components/Button'; 
import axios from "axios";

async function postNewGame(username, rounds)
{
  const response = await axios.post('http://localhost:5001/api/create-game', 
    {
      username: username,
      rounds: rounds,
    });
}

function CreateGame({onNavigate, username, rounds, setRounds})
{
  return (
    <div>
      <LogoHomeScreen/>
      <div className='font-bold w-[375px] h-[812px] flex justify-center items-center flex-col gap-3'>
        <Button className={'shadow-2xl'} text="2 rounds" onClick={() => {setRounds(2); postNewGame(username, 2); onNavigate('game-lobby')}}/>
        <Button className={'shadow-2xl'} text="5 rounds" onClick={() => {setRounds(5); postNewGame(username, rounds); onNavigate('game-lobby')}}/>
        <Button className={'shadow-2xl'} text="10 rounds" onClick={() => {setRounds(10); postNewGame(username, rounds); onNavigate('game-lobby')}}/>
        <Button className={'shadow-2xl'} text="20 rounds" onClick={() => {setRounds(20); postNewGame(username, rounds); onNavigate('game-lobby')}}/>
      </div>
    </div>
  );
}

export default CreateGame;