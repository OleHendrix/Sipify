import React from 'react';
import LogoHomeScreen from '../components/LogoHomeScreen';
import Button from '../components/Button'; 
import axios from "axios";
// import { useNavigate } from "react-router-dom";

async function postNewGame(username, rounds, setGamePin)
{
  try
  {
    const response = await axios.post('http://localhost:5001/api/games/create', {username: username, rounds: rounds});
    const gamePin = response.data.gamePin;
    setGamePin(gamePin);
    window.location.href = `http://localhost:5001/api/spotify/login?gamePin=${gamePin}&username=${encodeURIComponent(username)}&host=${true}`;
  }
  catch (error)
  {
    console.error("Error creating game:", error);
  }
}

function CreateGame({username, setRounds, setGamePin})
{
  return (
    <div>
      <LogoHomeScreen/>
      <div className='font-bold w-[375px] h-[812px] flex justify-center items-center flex-col gap-3'>
        <Button className={'shadow-2xl'} text="2 rounds" onClick={() => {setRounds(2); postNewGame(username, 2, setGamePin);}}/>
        <Button className={'shadow-2xl'} text="5 rounds" onClick={() => {setRounds(5); postNewGame(username, 5, setGamePin);}}/>
        <Button className={'shadow-2xl'} text="10 rounds" onClick={() => {setRounds(10); postNewGame(username, 10, setGamePin);}}/>
        <Button className={'shadow-2xl'} text="20 rounds" onClick={() => {setRounds(20); postNewGame(username, 20, setGamePin);}}/>
      </div>
    </div>
  );
}

export default CreateGame;